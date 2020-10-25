import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDashboardComponent } from './components/customers/customer-dashboard/customer-dashboard.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { EditCustomerComponent } from './components/customers/edit-customer/edit-customer.component';
import { ProductListComponent } from './components/settings/product-list/product-list.component';
import { EditProductComponent } from './components/settings/edit-product/edit-product.component';
import { TestProductComponent } from './components/customers/test-product/test-product.component';

const routes: Routes = [
  {
    path: 'customer/:customerId',
    component: CustomerDashboardComponent,
  },
  {
    path: 'customer/:customerId/edit',
    component: EditCustomerComponent,
  },
  {
    path: 'customer/:customerId/environment/:environmentId/product/:productId/test',
    component: TestProductComponent,
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'products/:productId/edit',
    component: EditProductComponent
  },
  {
    path: '',
    component: MainDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
