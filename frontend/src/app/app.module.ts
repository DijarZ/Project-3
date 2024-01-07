import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardPanelProductsComponent } from './dashboard-panel-products/dashboard-panel-products.component';
import { UsersComponent } from './dashboard-panel/users/users.component';
import { ProductsComponent } from './products/products.component';
import { OrderItemsComponent } from './order-items/order-items.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateAccountComponent,
    DashboardPanelComponent,
    DashboardPanelProductsComponent,
    UsersComponent,
    ProductsComponent,
    OrderItemsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
