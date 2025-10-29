/* wallet-service.ts */
import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  getWallets,
  StandardConnect,
  StandardDisconnect,
  SuiSignAndExecuteTransaction,
  type Wallet,
  type WalletAccount,
} from '@mysten/wallet-standard';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

export interface WalletState {
  isConnected: boolean;
  accounts: readonly WalletAccount[];
  selectedWallet?: Wallet;
  selectedChain?: string; // e.g. 'sui:testnet'
  error?: string;
  suiBalance?: bigint; // in MIST
}

@Injectable({ providedIn: 'root' })
export class WalletService implements OnDestroy {
  private walletStateSubject = new BehaviorSubject<WalletState>({
    isConnected: false,
    accounts: [],
    selectedChain: undefined,
  });
  public walletState$: Observable<WalletState> = this.walletStateSubject.asObservable();

  private client = new SuiClient({ url: getFullnodeUrl('testnet') });
  private selectedWallet: Wallet | null = null;

  private perWalletUnsubscribes: (() => void)[] = [];
  private registryUnsubscribes: (() => void)[] = [];
  private pollIntervalId: any = null;

  constructor(private ngZone: NgZone) {
    this.setupWalletRegistryListeners();
    this.subscribeToWalletEvents();
    this.autoReconnect();

    // Poll fallback for wallets that do not emit account-change events reliably
    this.pollIntervalId = setInterval(() => this.verifyAccountChange(), 8000);
  }

  ngOnDestroy() {
    this.cleanup();
    if (this.pollIntervalId) clearInterval(this.pollIntervalId);
  }

  // -------------------------
  // Public API
  // -------------------------
  getAvailableWallets(): readonly Wallet[] {
    return getWallets().get();
  }

  getClient(): SuiClient {
    return this.client;
  }

  getCurrentState(): WalletState {
    return this.walletStateSubject.value;
  }

  // -------------------------
  // Connect / Disconnect
  // -------------------------
  async connect(walletName?: string): Promise<void> {
    try {
      const wallets = getWallets().get();
      const wallet = walletName ? wallets.find((w) => w.name === walletName) : wallets[0];
      if (!wallet) throw new Error('No compatible wallet found.');

      this.selectedWallet = wallet;
      const connectFeature = wallet.features[StandardConnect] as any;
      if (!connectFeature || typeof connectFeature.connect !== 'function')
        throw new Error('Wallet does not expose StandardConnect');

      // Request connection / accounts
      const res = await connectFeature.connect();
      const accounts = res?.accounts ?? wallet.accounts ?? [];

      if (!Array.isArray(accounts) || accounts.length === 0) {
        throw new Error('Connection succeeded but no accounts authorized.');
      }

      // Try to detect the wallet's current chain (if wallet supports it)
      const walletReportedChain = await this.detectCurrentChainFromWallet(wallet);
      const preferredChain = 'sui:testnet';

      // Update state & client
      this.updateState(true, accounts, wallet, preferredChain);
      this.updateClientForChain(preferredChain);
      this.savePersistentState(wallet.name, preferredChain);

      // Ensure we are subscribed to this wallet's events
      this.subscribeToSingleWalletEvents(wallet);
    } catch (err: any) {
      console.error('Wallet connect error:', err);
      this.updateState(false, [], undefined, undefined, err?.message ?? String(err));
      this.clearPersistentState();
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const cur = this.walletStateSubject.value;
      if (cur.selectedWallet && StandardDisconnect in cur.selectedWallet.features) {
        const disconnectFeature = cur.selectedWallet.features[StandardDisconnect] as any;
        if (disconnectFeature && typeof disconnectFeature.disconnect === 'function') {
          await disconnectFeature.disconnect();
        }
      }
    } catch (e) {
      console.warn('Disconnect error (ignored):', e);
    } finally {
      this.selectedWallet = null;
      this.clearPersistentState();
      const defaultChain = 'sui:testnet';
      this.updateState(false, [], undefined, defaultChain);
    }
  }

  // -------------------------
  // Force refresh (use when account changed in UI)
  // -------------------------
  public async forceRefreshWalletState(): Promise<void> {
    const currentState = this.walletStateSubject.value;
    const wallet = currentState.selectedWallet;

    if (!wallet) {
      this.updateState(false, [], undefined, currentState.selectedChain, 'No wallet is currently selected.');
      return;
    }

    try {
      const connectFeature = wallet.features[StandardConnect] as any;
      let freshAccounts: readonly WalletAccount[] = [];

      if (connectFeature && typeof connectFeature.connect === 'function') {
        const res = await connectFeature.connect();
        freshAccounts = res?.accounts ?? wallet.accounts ?? [];
      } else {
        freshAccounts = wallet.accounts ?? [];
      }

      const walletReportedChain = await this.detectCurrentChainFromWallet(wallet);
      const preferredChain = 'sui:testnet';

      if (freshAccounts.length > 0) {
        this.ngZone.run(() => {
          this.updateState(true, freshAccounts, wallet, preferredChain);
          this.savePersistentState(wallet.name, preferredChain);
          console.log('Forced state refresh complete. New address:', freshAccounts[0].address);
        });
      } else {
        this.ngZone.run(() => this.disconnect());
      }
    } catch (error: any) {
      console.error('Error during forced state refresh:', error);
      this.ngZone.run(() => {
        this.disconnect();
        this.updateState(false, [], undefined, undefined, error?.message ?? 'Failed to refresh wallet state.');
      });
    }
  }

  // -------------------------
  // signAndExecuteTransaction with fallback
  // -------------------------
  async signAndExecuteTransaction(tx: Transaction, options?: any): Promise<any> {
    const state = this.walletStateSubject.value;
    if (!state.isConnected || !state.accounts[0] || !state.selectedWallet) {
      throw new Error('Wallet not connected');
    }

    const wallet = state.selectedWallet;
    const feature = wallet.features[SuiSignAndExecuteTransaction];
    if (!feature) throw new Error('Wallet does not support signAndExecuteTransaction');

    // Try passing Transaction object first (wallets that accept it will use .toJSON internally)
    try {
      return await this.ngZone.run(async () => {
        const result = await (feature as any).signAndExecuteTransaction({
          account: state.accounts[0],
          transaction: tx,
          chain: state.selectedChain,
          options: { showEffects: true, showEvents: true, ...options },
        });
        await this.getSuiBalance();
        return result;
      });
    } catch (err: any) {
      // If the wallet complains about toJSON / expects bytes => fallback to bytes
      const message = String(err?.message ?? err);
      const needsBytes = /toJSON|not a function|Uint8Array|bytes/i.test(message);

      if (!needsBytes) {
        throw err;
      }

      const bytes = await tx.build({ client: this.client });

      return await this.ngZone.run(async () => {
        const result = await (feature as any).signAndExecuteTransaction({
          account: state.accounts[0],
          transaction: bytes,
          chain: state.selectedChain,
          options: { showEffects: true, showEvents: true, ...options },
        });
        await this.getSuiBalance();
        return result;
      });
    }
  }

  // -------------------------
  // Chain switching
  // -------------------------
  async switchChain(chainId: string): Promise<void> {
    const cur = this.walletStateSubject.value;
    if (!cur.selectedWallet) throw new Error('No wallet connected');
    const walletAny = cur.selectedWallet as any;

    try {
      if (typeof walletAny.switchChain === 'function') {
        await walletAny.switchChain(chainId);
      } else if (walletAny.features?.['standard:chain']?.request) {
        await walletAny.features['standard:chain'].request({ chain: chainId });
      } else {
        throw new Error('Programmatic chain change not supported by the selected wallet.');
      }

      // Update client + state
      this.updateClientForChain(chainId);
      this.updateState(true, cur.accounts, cur.selectedWallet, chainId);
      this.savePersistentState(cur.selectedWallet!.name, chainId);
    } catch (err: any) {
      throw new Error(err?.message || 'Chain change failed / unsupported');
    }
  }

  // -------------------------
  // Balance fetch
  // -------------------------
  async getSuiBalance(): Promise<bigint | undefined> {
    const state = this.walletStateSubject.value;
    const address = state.accounts[0]?.address;

    if (!address) {
      this.updateStateWithBalance(undefined);
      return undefined;
    }

    try {
      const balanceResponse = await this.client.getBalance({
        owner: address,
        coinType: SUI_TYPE_ARG,
      });
      const balanceBigInt = BigInt(balanceResponse.totalBalance ?? 0);
      this.updateStateWithBalance(balanceBigInt);
      return balanceBigInt;
    } catch (e) {
      console.error('Failed to fetch SUI balance:', e);
      this.updateStateWithBalance(undefined);
      return undefined;
    }
  }

  // -------------------------
  // Internal helpers & events
  // -------------------------
  private chooseChainForWallet(wallet: Wallet): string {
    const saved = this.readSavedChain();
    const walletChain = this.normalizeChain(Array.isArray(wallet.chains) && wallet.chains.length > 0 ? wallet.chains[0] : null);
    return 'sui:testnet';
  }

  private normalizeChain(chain?: string | null): string | null {
    if (!chain) return null;
    const c = String(chain).trim();
    if (!c) return null;
    if (!c.includes(':')) return null;
    return c;
  }

  private updateStateWithBalance(balance?: bigint) {
    const currentState = this.walletStateSubject.value;
    const newState: WalletState = {
      ...currentState,
      suiBalance: balance,
    };
    this.walletStateSubject.next(newState);
  }

  private updateState(
    isConnected: boolean,
    accounts: readonly WalletAccount[],
    wallet?: Wallet,
    chain?: string,
    error?: string
  ) {
    const finalChain = 'sui:testnet';
    const newBalance = isConnected ? this.walletStateSubject.value.suiBalance : undefined;

    const newState: WalletState = {
      isConnected,
      accounts,
      selectedWallet: wallet,
      selectedChain: finalChain,
      error,
      suiBalance: newBalance,
    };

    this.walletStateSubject.next(newState);

    if (isConnected && accounts.length > 0) {
      // fetch balance (non-blocking)
      this.getSuiBalance().catch((e) => console.warn('getSuiBalance failed in updateState:', e));
    }
  }

  private updateClientForChain(chainId: string) {
    const normalized = 'sui:testnet';
    try {
      const [, net] = normalized.split(':');
      if (net) {
        const networkKey = net as 'testnet' | 'mainnet' | 'devnet' | 'localnet';
        this.client = new SuiClient({
          url: getFullnodeUrl(networkKey),
        });
        console.log(`SuiClient updated for network: ${networkKey}`);
      }
    } catch (e) {
      console.warn('Failed to update client for chain', chainId, e);
    }
  }

  private setupWalletRegistryListeners() {
    const registry = getWallets();
    if (typeof (registry as any).on === 'function') {
      const onRegister = (wallet: Wallet) => {
        console.log('Wallet registered:', wallet.name);
        this.subscribeToSingleWalletEvents(wallet);
      };
      const onUnregister = (wallet: Wallet) => {
        console.log('Wallet unregistered:', wallet.name);
        const cur = this.walletStateSubject.value;
        if (cur.selectedWallet?.name === wallet.name) {
          this.updateState(false, [], undefined);
          this.selectedWallet = null;
          this.clearPersistentState();
        }
      };

      (registry as any).on('register', onRegister);
      (registry as any).on('unregister', onUnregister);

      this.registryUnsubscribes.push(() => (registry as any).off?.('register', onRegister));
      this.registryUnsubscribes.push(() => (registry as any).off?.('unregister', onUnregister));
    }
  }

  private subscribeToWalletEvents() {
    getWallets().get().forEach((wallet) => this.subscribeToSingleWalletEvents(wallet));
  }

  private async detectCurrentChainFromWallet(wallet: Wallet): Promise<string | null> {
    try {
      const chainFeature = (wallet as any).features?.['standard:chain'];
      if (chainFeature?.get) {
        const chainId = await chainFeature.get();
        return this.normalizeChain(chainId);
      }
      return this.normalizeChain(Array.isArray(wallet.chains) && wallet.chains.length > 0 ? wallet.chains[0] : null);
    } catch (e) {
      console.warn('detectCurrentChainFromWallet failed', e);
      return null;
    }
  }

  private subscribeToSingleWalletEvents(wallet: Wallet) {
    if (!wallet?.features?.['standard:events']) return;
    const eventsFeature = wallet.features['standard:events'] as any;
    if (typeof eventsFeature.on !== 'function') return;

    const cb = async (payload: { accounts?: WalletAccount[]; chains?: string[] }) => {
      const cur = this.walletStateSubject.value;

      // Only react if this event is from selected wallet (ignore others)
      if (wallet.name !== cur.selectedWallet?.name) {
        return;
      }

      let newChain = cur.selectedChain;
      let accounts = cur.accounts;

      if (payload.chains && payload.chains.length > 0) {
        newChain = 'sui:testnet';
        this.updateClientForChain(newChain);
      }

      // If payload.accounts missing, try to read wallet.accounts as fallback
      if (!payload.accounts || payload.accounts.length === 0) {
        try {
          const fallbackAccounts = wallet.accounts ?? [];
          if (fallbackAccounts && fallbackAccounts.length > 0) {
            accounts = fallbackAccounts;
          }
        } catch (e) {
          // ignore
        }
      } else {
        accounts = payload.accounts;
      }

      // If accounts empty => disconnected from wallet
      if (!accounts || accounts.length === 0) {
        this.ngZone.run(() => this.disconnect());
        return;
      }

      const addressChanged = cur.accounts[0]?.address !== accounts[0]?.address;
      const chainChanged = newChain !== cur.selectedChain;

      if (addressChanged || chainChanged) {
        this.ngZone.run(() => {
          this.updateState(true, accounts, wallet, newChain);
          this.savePersistentState(wallet.name, 'sui:testnet');
        });
      } else {
        // Still update state to ensure fresh refs (and maybe balance)
        this.ngZone.run(() => {
          this.updateState(true, accounts, wallet, newChain);
        });
      }
    };

    const unsubscribe = eventsFeature.on('change', cb);
    if (typeof unsubscribe === 'function') {
      this.perWalletUnsubscribes.push(unsubscribe);
    } else {
      this.perWalletUnsubscribes.push(() => (eventsFeature as any).off?.('change', cb));
    }
  }

  // -------------------------
  // Poll fallback to detect account change
  // -------------------------
  private async verifyAccountChange() {
    const cur = this.walletStateSubject.value;
    if (!cur.isConnected || !cur.selectedWallet) return;

    try {
      const wallet = cur.selectedWallet;
      const currentAccounts = wallet.accounts ?? [];
      const oldAddress = cur.accounts[0]?.address;
      const newAddress = currentAccounts[0]?.address;

      if (oldAddress !== newAddress && newAddress) {
        console.log('Detected account change (poll):', newAddress);
        this.ngZone.run(() => {
          this.updateState(true, currentAccounts, wallet, cur.selectedChain);
          this.savePersistentState(wallet.name, 'sui:testnet');
        });
      }
    } catch (err) {
      // ignore polling errors
    }
  }

  // -------------------------
  // Auto reconnect
  // -------------------------
  private async autoReconnect(): Promise<void> {
    await new Promise((r) => setTimeout(r, 600));
    try {
      const wallets = getWallets().get();
      const saved = this.readSavedState();
      const savedChain = this.normalizeChain(saved?.chain);
      let reconnected = false;

      if (saved?.walletName) {
        const match = wallets.find((w) => w.name === saved.walletName);
        if (match && match.accounts.length > 0) {
          this.selectedWallet = match;
          const walletChainDefault = this.normalizeChain(match.chains?.[0]);
          const chosenChain = 'sui:testnet';

          this.updateState(true, match.accounts, match, chosenChain);
          this.updateClientForChain(chosenChain);
          reconnected = true;
        }
      }

      if (!reconnected) {
        for (const wallet of wallets) {
          if (wallet.accounts && wallet.accounts.length > 0) {
            this.selectedWallet = wallet;
            const walletChainDefault = this.normalizeChain(wallet.chains?.[0]);
            const chosenChain = 'sui:testnet';

            this.updateState(true, wallet.accounts, wallet, chosenChain);
            this.updateClientForChain(chosenChain);
            this.savePersistentState(wallet.name, chosenChain);
            reconnected = true;
            break;
          }
        }
      }

      if (!reconnected) {
        const initialChain = 'sui:testnet';
        this.updateClientForChain(initialChain);
        this.updateState(false, [], undefined, initialChain);
      }
    } catch (e) {
      console.warn('Auto reconnect failed:', e);
    }
  }

  // -------------------------
  // Persistence helpers
  // -------------------------
  private savePersistentState(walletName: string, chain: string) {
    try {
      localStorage.setItem('walletState', JSON.stringify({ walletName, chain }));
    } catch { }
  }

  private readSavedState(): { walletName?: string; chain?: string } | null {
    try {
      const raw = localStorage.getItem('walletState');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private readSavedChain(): string | null {
    const s = this.readSavedState();
    return this.normalizeChain(s?.chain ?? null);
  }

  private clearPersistentState() {
    try {
      localStorage.removeItem('walletState');
    } catch { }
  }

  // -------------------------
  // Cleanup
  // -------------------------
  public cleanup() {
    this.perWalletUnsubscribes.forEach((fn) => fn());
    this.perWalletUnsubscribes = [];
    this.registryUnsubscribes.forEach((fn) => fn());
    this.registryUnsubscribes = [];
  }
}
