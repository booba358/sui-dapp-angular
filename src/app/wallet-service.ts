import { Injectable, OnDestroy, NgZone } from '@angular/core'; 
import { BehaviorSubject, Observable } from 'rxjs';
import {
  getWallets,
  StandardConnect,
  StandardDisconnect,
  SuiSignAndExecuteTransaction,
  type Wallet,
  type WalletAccount
} from '@mysten/wallet-standard';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { toBase64 } from '@mysten/sui/utils';

// --- Interface Definition ---
export interface WalletState {
  isConnected: boolean;
  accounts: readonly WalletAccount[];
  selectedWallet?: Wallet;
  selectedChain?: string; // e.g. "sui:testnet"
  error?: string;
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

  constructor(private ngZone: NgZone) { 
    this.setupWalletRegistryListeners();
    // FIX: Calling the zero-argument wrapper function
    this.subscribeToWalletEvents(); 
    this.autoReconnect();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  // -----------------------------
  // PUBLIC API
  // -----------------------------

  getAvailableWallets(): readonly Wallet[] {
    return getWallets().get();
  }

  getClient(): SuiClient {
    return this.client;
  }

  getCurrentState(): WalletState {
    return this.walletStateSubject.value;
  }

  // --- Connection / Disconnection ---

  async connect(walletName?: string): Promise<void> {
    try {
      const wallets = getWallets().get();
      const wallet = walletName ? wallets.find((w) => w.name === walletName) : wallets[0];
      if (!wallet) throw new Error('No compatible wallet found.');

      this.selectedWallet = wallet;
      const connectFeature = wallet.features[StandardConnect] as any;
      if (!connectFeature) throw new Error('Wallet does not expose StandardConnect');

      const res = await connectFeature.connect();
      const accounts = res?.accounts ?? wallet.accounts ?? []; 
      
      if (accounts.length === 0) throw new Error('Connection successful, but no accounts authorized.');

      const preferredChain = this.chooseChainForWallet(wallet);
      const walletChain = this.normalizeChain(wallet.chains?.[0]) || preferredChain;

      this.updateState(true, accounts, wallet, preferredChain);
      this.updateClientForChain(preferredChain);
      this.savePersistentState(wallet.name, preferredChain);
      
      if (walletChain !== preferredChain) {
        await this.switchChain(preferredChain).catch((err) => {
             console.warn(`Programmatic chain switch failed: ${err.message}. User must switch manually.`);
        });
      }

    } catch (err: any) {
      console.error('Wallet connect error:', err);
      this.updateState(false, [], undefined, undefined, err?.message ?? String(err));
      this.clearPersistentState();
    }
  }

  async disconnect(): Promise<void> {
    try {
      const cur = this.walletStateSubject.value;
      if (cur.selectedWallet && StandardDisconnect in cur.selectedWallet.features) {
        const disconnectFeature = cur.selectedWallet.features[StandardDisconnect] as any;
        await disconnectFeature.disconnect();
      }
    } catch (e) {
      console.warn('Disconnect error (ignored):', e);
    } finally {
      this.selectedWallet = null;
      this.clearPersistentState();
      const defaultChain = this.normalizeChain(this.walletStateSubject.value.selectedChain) ?? 'sui:testnet';
      this.updateState(false, [], undefined, defaultChain);
    }
  }

  // --- Manual Refresh/Fallback (FIX FOR ACCOUNT SWITCH) ---
  public async forceRefreshWalletState(): Promise<void> {
    const currentState = this.walletStateSubject.value;
    const wallet = currentState.selectedWallet;

    if (!wallet) {
      this.updateState(false, [], undefined, currentState.selectedChain, 'No wallet is currently selected.');
      return;
    }

    this.ngZone.run(async () => {
        try {
            const connectFeature = wallet.features[StandardConnect] as any;
            let freshAccounts: readonly WalletAccount[] = [];

            if (connectFeature) {
                const res = await connectFeature.connect(); 
                freshAccounts = res?.accounts ?? wallet.accounts ?? [];
            } else {
                freshAccounts = wallet.accounts;
            }

            const preferredChain = currentState.selectedChain ?? this.chooseChainForWallet(wallet);

            if (freshAccounts.length > 0) {
                this.updateState(true, freshAccounts, wallet, preferredChain);
                this.savePersistentState(wallet.name, preferredChain);
                console.log('Forced state refresh complete. New address:', freshAccounts[0].address);
            } else {
                this.disconnect();
            }
        } catch (error: any) {
            console.error('Error during forceful state refresh:', error);
            this.disconnect();
            this.updateState(false, [], undefined, undefined, error?.message ?? 'Failed to refresh wallet state.');
        }
    });
  }


  // --- Transaction / Chain Management ---

  async signAndExecuteTransaction(tx: Transaction, options?: any): Promise<any> {
    const state = this.walletStateSubject.value;
    if (!state.isConnected || !state.accounts[0] || !state.selectedWallet) {
      throw new Error('Wallet not connected');
    }

    const wallet = state.selectedWallet;
    const feature = wallet.features[SuiSignAndExecuteTransaction];
    if (!feature)
      throw new Error('Wallet does not support signAndExecuteTransaction');

    const bytes = await tx.build({ client: this.client });
    const serialized = toBase64(bytes);

    return await (feature as any).signAndExecuteTransaction({
      account: state.accounts[0],
      transaction: serialized,
      chain: state.selectedChain,
      options: { showEffects: true, showEvents: true, ...options },
    });
  }

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

      this.updateClientForChain(chainId);
      this.updateState(true, cur.accounts, cur.selectedWallet, chainId);
      this.savePersistentState(cur.selectedWallet!.name, chainId);
    } catch (err: any) {
      throw new Error(err?.message || 'Chain change failed / unsupported');
    }
  }

  // -----------------------------
  // INTERNALS & EVENT LISTENERS
  // -----------------------------

  private chooseChainForWallet(wallet: Wallet): string {
    const saved = this.readSavedChain();
    const walletChain = this.normalizeChain(Array.isArray(wallet.chains) && wallet.chains.length > 0 ? wallet.chains[0] : null);

    return saved || walletChain || 'sui:testnet';
  }

  private normalizeChain(chain?: string | null): string | null {
    if (!chain) return null;
    const c = String(chain).trim();
    if (!c) return null;
    if (!c.includes(':')) return null;
    return c;
  }

  private updateState(
    isConnected: boolean,
    accounts: readonly WalletAccount[],
    wallet?: Wallet,
    chain?: string,
    error?: string
  ) {  
    const finalChain = this.normalizeChain(chain ?? this.walletStateSubject.value.selectedChain) ?? 'sui:testnet';
    const newState: WalletState = {
      isConnected,
      accounts,
      selectedWallet: wallet,
      selectedChain: finalChain,
      error,
    };

    this.walletStateSubject.next(newState);
  }

  private updateClientForChain(chainId: string) {
    const normalized = this.normalizeChain(chainId) ?? 'sui:testnet';
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
        // Calls the function that takes the wallet argument
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

  // FIX: This wrapper takes NO arguments (resolves ts(2554) error in constructor)
  private subscribeToWalletEvents() {
    getWallets().get().forEach((wallet) => this.subscribeToSingleWalletEvents(wallet));
  }

  private subscribeToSingleWalletEvents(wallet: Wallet) {
    if (!wallet?.features?.['standard:events']) return;
    const eventsFeature = wallet.features['standard:events'] as any;
    if (typeof eventsFeature.on !== 'function') return;

    const cb = (payload: { accounts?: WalletAccount[]; chains?: string[] }) => {
        const cur = this.walletStateSubject.value;
        
        if (wallet.name !== cur.selectedWallet?.name) {
            return; 
        }

        let newChain = cur.selectedChain;
        let accounts = cur.accounts;

        if (payload.chains && payload.chains.length > 0) {
            newChain = this.normalizeChain(payload.chains[0]) ?? newChain ?? 'sui:testnet';
            this.updateClientForChain(newChain);
        }

        // Account changed (Switch Account functionality relies on this payload)
        if (payload.accounts) {
            const isConnected = Array.isArray(payload.accounts) && payload.accounts.length > 0;
            
            if (!isConnected) {
                this.ngZone.run(() => {
                    this.disconnect();
                });
                return;
            }

            accounts = payload.accounts;
        }

        // Final State Update: NgZone forces change detection
        if (accounts.length > 0) {
            this.ngZone.run(() => { 
                this.updateState(true, accounts, wallet, newChain);
                this.savePersistentState(wallet.name, newChain ?? 'sui:testnet');
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

  // -----------------------------
  // AUTO RECONNECT & PERSISTENCE
  // -----------------------------
  
  private async autoReconnect(): Promise<void> {
    await new Promise((r) => setTimeout(r, 1000)); 
    try {
        const wallets = getWallets().get();
        const saved = this.readSavedState();
        const savedChain = this.normalizeChain(saved?.chain); 
        let reconnected = false;

        if (saved?.walletName) {
            const match = wallets.find(w => w.name === saved.walletName);
            if (match && match.accounts.length > 0) { 
                this.selectedWallet = match;
                const walletChainDefault = this.normalizeChain(match.chains[0]);
                const chosenChain = savedChain || walletChainDefault || 'sui:testnet';

                this.updateState(true, match.accounts, match, chosenChain);
                this.updateClientForChain(chosenChain);
                reconnected = true;
            }
        }
        
        if (!reconnected) {
            for (const wallet of wallets) {
                if (wallet.accounts && wallet.accounts.length > 0) {
                    this.selectedWallet = wallet;
                    const walletChainDefault = this.normalizeChain(wallet.chains[0]);
                    const chosenChain = savedChain || walletChainDefault || 'sui:testnet';
    
                    this.updateState(true, wallet.accounts, wallet, chosenChain);
                    this.updateClientForChain(chosenChain);
                    this.savePersistentState(wallet.name, chosenChain);
                    reconnected = true;
                    break;
                }
            }
        }
        
        if (!reconnected) {
            const initialChain = savedChain || 'sui:testnet';
            this.updateClientForChain(initialChain);
            this.updateState(false, [], undefined, initialChain);
        }
    } catch (e) {
        console.warn('Auto reconnect failed:', e);
    }
  }

  private savePersistentState(walletName: string, chain: string) {
    try {
      localStorage.setItem('walletState', JSON.stringify({ walletName, chain }));
    } catch {}
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
    try { localStorage.removeItem('walletState'); } catch {}
  }

  private cleanup() {
    this.perWalletUnsubscribes.forEach((fn) => fn());
    this.perWalletUnsubscribes = [];
    this.registryUnsubscribes.forEach((fn) => fn());
    this.registryUnsubscribes = [];
  }
}