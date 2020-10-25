import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomerDisplayService } from '../../../services/customer-display.service';
import { ProductDisplayService } from '../../../services/product-display.service';
import { CustomerEnvironmentDisplayService } from '../../../services/customer-environment-display.service';
import { Observable } from 'rxjs';
import { Customer, CustomerEnvironment } from '../../../store/customer/customer.interfaces';
import { Product, ProductUseCase } from '../../../store/product/product.interfaces';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Test, TestResult } from '../../../store/test/test.interfaces';
import { AppFirestoreService } from '../../../services/app-firestore.service';
import { Dictionary } from '@ngrx/entity';
import { TestDisplayService } from '../../../services/test-display.service';

@Component({
  selector: 'app-test-product',
  templateUrl: './test-product.component.html',
  styleUrls: ['./test-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CustomerDisplayService, ProductDisplayService, CustomerEnvironmentDisplayService, TestDisplayService],
})
export class TestProductComponent implements OnInit {
  public customer$: Observable<Customer>;
  public environment$: Observable<CustomerEnvironment>;
  public product$: Observable<Product>;
  public useCases$: Observable<Dictionary<ProductUseCase>>;

  public tests$: Observable<Test[]>;
  public trackTest(index: number, test: Test) {
    return test.id;
  }

  constructor(
    private testDisplayService: TestDisplayService,
    private customerDisplayService: CustomerDisplayService,
    private productDisplayService: ProductDisplayService,
    private customerEnvironmentDisplayService: CustomerEnvironmentDisplayService,
    private store: Store,
    private snackBar: MatSnackBar,
    private router: Router,
    private firestore: AppFirestoreService,
  ) {}

  ngOnInit(): void {
    this.testDisplayService.init();

    this.customer$ = this.customerDisplayService.customer$;
    this.environment$ = this.customerEnvironmentDisplayService.environment$;
    this.product$ = this.productDisplayService.product$;

    this.useCases$ = this.testDisplayService.useCaseDict$;

    this.tests$ = this.testDisplayService.tests$;
  }

  public async toggleResult(test: Test) {
    let nextState: TestResult;

    switch (test.result) {
      case TestResult.passed:
        nextState = TestResult.failed;
        break;
      case TestResult.failed:
        nextState = TestResult.notRun;
        break;
      default:
        nextState = TestResult.passed;
        break;
    }

    try {
      await this.firestore.testCollection.doc(test.id).set({
        ...test,
        result: nextState,
      });
    } catch (e) {
      console.error(e);
      this.snackBar.open('Something went wrong when updating test result, please check F12 for more information', '', { duration: 5000 });
    }
  }
}
