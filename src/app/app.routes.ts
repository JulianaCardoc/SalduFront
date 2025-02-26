import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { InvoiceDetailComponent } from './views/dashboard-pages/invoices/invoice-detail/invoice-detail.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { ProductDetailComponent } from './views/dashboard-pages/products/product-detail/product-detail.component';
import { OrderDetailComponent } from './views/dashboard-pages/orders/order-detail/order-detail.component';

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
            path: 'pending-invoices',
            loadComponent: () => import('./views/dashboard-pages/invoices/invoices-list/invoices-list.component').then(m => m.InvoicesListComponent)
          },
          {
            path: 'done-invoices',
            loadComponent: () => import('./views/dashboard-pages/invoices/done-invoices/done-invoices.component').then(m => m.DoneInvoicesComponent)
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./views/dashboard-pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'upload-products',
            loadComponent: () => import('./views/dashboard-pages/products/upload-products/upload-products.component').then(m => m.UploadProductsComponent)
          },
          {
            path: 'products-list',
            loadComponent: () => import('./views/dashboard-pages/products/products-list/products-list.component').then(m => m.ProductsListComponent)
          },
          {
            path: 'provider-products',
            loadComponent: () => import('./views/dashboard-pages/products/provider-products/provider-products.component').then(m => m.ProviderProductsComponent)
          },
          {
            path: 'create-user',
            loadComponent: () => import('./views/dashboard-pages/users/create-user/create-user.component').then(m => m.CreateUserComponent)
          },
          {
            path: 'user-edition',
            loadComponent: () => import('./views/dashboard-pages/users/edit-user/edit-user.component').then(m => m.EditUserComponent)
          },
          {
            path: 'products-management',
            loadComponent: () => import('./views/dashboard-pages/products/products-management/products-management.component').then(m => m.ProductsManagementComponent)
          },
          {
            path: 'product-detail/:providerId/:productId',
            loadComponent: () => import('./views/dashboard-pages/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
          },
          {
            path: 'orders-list',
            loadComponent: () => import('./views/dashboard-pages/orders/orders-list/orders-list.component').then(m => m.OrdersListComponent)
          },
        ]
      },
      {
        path: 'invoice-detail/:id',
        canActivate: [AuthGuard],
        component: InvoiceDetailComponent,
        pathMatch: 'full'
      },
      {
        path: 'order-detail/:orderId/:providerId',
        canActivate: [AuthGuard],
        component: OrderDetailComponent,
        pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundComponent,
        pathMatch: 'full'
      }
];
