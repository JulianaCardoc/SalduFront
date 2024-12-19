import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';


export const routes: Routes = [
  {
    path: '',
    canActivate: [ RedirectGuard ],
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule)
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'invoices',
        loadComponent: () => import('./shared-components/invoices/invoices.component').then(m => m.InvoicesComponent)
      }
    ]
  },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Ruta por defecto
  // { 
  //   path: 'dashboard', 
  //   loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent) 
  // },
  // { 
  //   path: 'invoices', 
  //   loadComponent: () => import('./shared-components/invoices/invoices.component').then(m => m.InvoicesComponent) 
  // },
];
