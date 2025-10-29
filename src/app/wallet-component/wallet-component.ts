/* wallet-component.ts */
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { WalletService, WalletState } from '../wallet-service'; // adjust path
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { type Wallet } from '@mysten/wallet-standard';
import { Transaction } from '@mysten/sui/transactions';

@Component({
  selector: 'app-wallet-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-component.html',
  styleUrls: ['./wallet-component.css'],
})
export class WalletComponent implements OnInit, OnDestroy {
  walletService = inject(WalletService);
  walletState$: Observable<WalletState> = this.walletService.walletState$;

  availableChains: string[] = [];
  availableWallets: readonly Wallet[] = [];
  private stateSubscription!: Subscription;

  public isLoading: boolean = false;
  public txProcessing: boolean = false;
  public lastTxDigest: string | null = null;
  public recipientAddress: string = '0x7a9d19d4c210663926eb549da59a54e25777fef63161bfccda08277b58b4212e';
  private readonly SUI_DECIMALS = 9;

  ngOnInit() {
    this.availableWallets = this.walletService.getAvailableWallets();

    this.stateSubscription = this.walletState$.subscribe((state) => {
      this.availableChains = state.selectedWallet?.chains as string[] ?? [];
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
  }

  get currentState(): WalletState {
    return this.walletService.getCurrentState();
  }

  get activeAddress(): string | undefined {
    const state = this.currentState;
    return state.accounts[0]?.address;
  }

  formatSuiBalance(mistBalance: bigint | undefined): string {
    if (mistBalance === undefined) return 'N/A';
    const mistString = mistBalance.toString();
    const padded = mistString.padStart(this.SUI_DECIMALS + 1, '0');
    const integerPart = padded.slice(0, -this.SUI_DECIMALS);
    const decimalPart = padded.slice(-this.SUI_DECIMALS).substring(0, 4);
    return `${integerPart}.${decimalPart} SUI`;
  }

  public getSuiScanLink(digest: string, chain?: string): string {
    const c = chain ?? this.currentState.selectedChain ?? 'sui:testnet';
    const network = c.includes('mainnet') ? '' : c.split(':')[1];
    return `https://suiscan.xyz/${network}/tx/${digest}`;
  }

  async connect() {
    this.isLoading = true;
    try {
      await this.walletService.connect();
    } catch (e) {
      console.error('Connection attempt failed:', e);
      alert('Connection failed. See console for details.');
    } finally {
      this.isLoading = false;
    }
  }

  async connectSpecificWallet(walletName: string) {
    this.isLoading = true;
    try {
      await this.walletService.connect(walletName);
    } catch (e) {
      console.error(`Connection to ${walletName} failed:`, e);
      alert('Connection failed. See console.');
    } finally {
      this.isLoading = false;
    }
  }

  async disconnect() {
    this.isLoading = true;
    try {
      await this.walletService.disconnect();
    } catch (e) {
      console.warn('Disconnect error (ignored):', e);
    } finally {
      this.isLoading = false;
    }
  }

  async switchChain(chain: string) {
    this.isLoading = true;
    try {
      await this.walletService.switchChain(chain);
    } catch (err: any) {
      console.error('Chain switch failed:', err);
      alert(`Failed to switch chain: ${err?.message || 'Unsupported operation'}`);
    } finally {
      this.isLoading = false;
    }
  }

  async refreshState() {
    this.isLoading = true;
    try {
      await this.walletService.forceRefreshWalletState();
    } catch (e) {
      console.error('Refresh failed:', e);
      alert('Failed to refresh wallet state. Check your wallet connection.');
    } finally {
      this.isLoading = false;
    }
  }

  async fetchBalance() {
    if (!this.walletService.getCurrentState().isConnected) return;
    this.isLoading = true;
    try {
      await this.walletService.getSuiBalance();
    } catch (e) {
      console.error('Manual balance fetch failed:', e);
    } finally {
      this.isLoading = false;
    }
  }

  /* -------------------------
     Transaction Action
     ------------------------- */
  async executeTransaction() {
    const state = this.currentState;

    if (!state.isConnected || !this.activeAddress || this.txProcessing) {
      alert('Connect wallet and select an account first.');
      return;
    }

    if (!this.recipientAddress || this.recipientAddress.length < 60) {
      alert('Please enter a valid recipient address.');
      return;
    }

    this.txProcessing = true;
    this.lastTxDigest = null;

    try {
      const txb = new Transaction();
      const amountInMist = BigInt(1_000_000); // example 0.001 SUI

      txb.setSender(this.activeAddress as any);
      const [coinToTransfer] = txb.splitCoins(txb.gas, [amountInMist]);
      txb.transferObjects([coinToTransfer], this.recipientAddress as any);

      const result = await this.walletService.signAndExecuteTransaction(txb);
      this.lastTxDigest = result?.digest ?? null;

      if (this.lastTxDigest) {
        alert(`Transaction successful! Digest: ${this.lastTxDigest}`);
      } else {
        alert('Transaction completed (no digest returned).');
      }
      console.log('Transaction Result:', result);
    } catch (error: any) {
      console.error('Transaction failed:', error);
      alert(`Transaction Failed: ${error?.message || 'See console for details.'}`);
    } finally {
      this.txProcessing = false;
    }
  }
}
