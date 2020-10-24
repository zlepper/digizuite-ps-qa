import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerDashboardComponent} from './components/customer-dashboard/customer-dashboard.component';
import {MainDashboardComponent} from './components/main-dashboard/main-dashboard.component';

const routes: Routes = [
  {
    path: 'customer/:customerId',
    component: CustomerDashboardComponent
  },
  {
    path: '',
    component: MainDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
