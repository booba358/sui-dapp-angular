import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'connect',
        loadComponent: () => import('./wallet-component/wallet-component').then((m) => m.WalletComponent)
    }
];
