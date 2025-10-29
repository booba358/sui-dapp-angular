import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { WalletService, WalletState } from '../wallet-service'; // Adjust path as needed
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-component.html',
  styleUrls: ['./wallet-component.css']
})
export class WalletComponent implements OnInit, OnDestroy {
  walletService = inject(WalletService);
  walletState$: Observable<WalletState> = this.walletService.walletState$;

  availableChains: string[] = [];
  private stateSubscription!: Subscription;
  
  public isLoading: boolean = false; 

  ngOnInit() {
    this.stateSubscription = this.walletState$.subscribe(state => {
      this.availableChains = state.selectedWallet?.chains as string[] ?? [];
    });
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
  }
  
  /**
   * Getter to safely retrieve the active address from the service's state.
   * This is necessary because state.accounts[0] may be stale due to wallet bugs.
   */
  get activeAddress(): string | undefined {
    const state = this.walletService.getCurrentState();
    return state.accounts[0]?.address;
  }

  async connect() {
    this.isLoading = true;
    try {
      await this.walletService.connect();
    } catch (e) {
      console.error('Connection attempt failed:', e);
    } finally {
      this.isLoading = false;
    }
  }

  async disconnect() {
    this.isLoading = true;
    try {
      await this.walletService.disconnect();
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

  async connectSpecificWallet(walletName: string) {
    this.isLoading = true;
    try {
      await this.walletService.connect(walletName);
    } catch (e) {
      console.error(`Connection to ${walletName} failed:`, e);
    } finally {
      this.isLoading = false;
    }
  }
  
  // FALLBACK FUNCTION FOR SWITCH ACCOUNT FAILURE
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
}