import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { DashboardPanelProductsComponent } from './dashboard-panel-products/dashboard-panel-products.component';
import { UsersComponent } from './dashboard-panel/users/users.component';
import { ProductsComponent } from './products/products.component';
import { OrderItemsComponent } from './order-items/order-items.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ShopingcartComponent } from './shopingcart/shopingcart.component';
import { CreateUserAdminComponent } from './dashboard-panel/users/create-user-admin/create-user-admin.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AboutComponent } from './about/about.component';
import { OrdersComponent } from './orders/orders.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
  },
  {
    path: 'dashboard-panel',
    component: DashboardPanelComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
        children: [
          {
            path: 'createUserAdmin',
            component: CreateUserAdminComponent,
          },
        ],
      },
      {
        path: 'dashboard-panel-products',
        component: DashboardPanelProductsComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
    ],
  },

  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'order-items',
    component: OrderItemsComponent,
  },
  {
    path: 'navbar',
    component: NavbarComponent,
  },
  {
    path: 'nav-bar',
    component: NavBarComponent,
  },
  {
    path: 'footer',
    component: FooterComponent,
  },
  {
    path: 'shopingcart',
    component: ShopingcartComponent,
  },
  {
    path: 'About',
    component: AboutComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
