import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AddNewCustomerDialogComponent } from './components/customers/add-new-customer-dialog/add-new-customer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerDashboardComponent } from './components/customers/customer-dashboard/customer-dashboard.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { customerReducer } from './store/customer/customer.reducer';
import { CustomerEffects } from './store/customer/customer.effects';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmDeleteDialogComponent } from './components/customers/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditCustomerComponent } from './components/customers/edit-customer/edit-customer.component';
import { MatCardModule } from '@angular/material/card';
import { ProductListComponent } from './components/settings/product-list/product-list.component';
import { ProductEffects } from './store/product/product.effects';
import { productFeatureKey } from './store/product/product.interfaces';
import { productReducer } from './store/product/product.reducer';
import { AddProductDialogComponent } from './components/settings/add-product-dialog/add-product-dialog.component';
import { ProductCardComponent } from './components/settings/product-list/product-card/product-card.component';
import { EditProductComponent } from './components/settings/edit-product/edit-product.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TestProductComponent } from './components/customers/test-product/test-product.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TestEffects } from './store/test/test.effects';
import { testFeatureKey } from './store/test/test.interfaces';
import { testReducer } from './store/test/test.reducer';
import { TestResultIconComponent } from './components/customers/test-result-icon/test-result-icon.component';
import { PieChartComponent } from './components/charts/pie-chart/pie-chart.component';
import { ChartsModule } from 'ng2-charts';
import { BlockChartComponent } from './components/charts/block-chart/block-chart.component';
import { NumberChartComponent } from './components/charts/number-chart/number-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    AddNewCustomerDialogComponent,
    CustomerDashboardComponent,
    MainDashboardComponent,
    ConfirmDeleteDialogComponent,
    EditCustomerComponent,
    ProductListComponent,
    AddProductDialogComponent,
    ProductCardComponent,
    EditProductComponent,
    TestProductComponent,
    TestResultIconComponent,
    PieChartComponent,
    BlockChartComponent,
    NumberChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    ChartsModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreModule.forFeature('customer', customerReducer),
    StoreModule.forFeature(productFeatureKey, productReducer),
    StoreModule.forFeature(testFeatureKey, testReducer),
    EffectsModule.forFeature([CustomerEffects, ProductEffects, TestEffects]),
    MatOptionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
