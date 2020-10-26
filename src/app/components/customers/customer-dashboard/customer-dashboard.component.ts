import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Customer, CustomerEnvironment, CustomerProduct } from '../../../store/customer/customer.interfaces';
import { CustomerDisplayService } from '../../../services/customer-display.service';
import { Product } from '../../../store/product/product.interfaces';
import { select, Store } from '@ngrx/store';
import { getProductDict, getUseCasesForProduct } from '../../../store/product/product.selectors';
import { Dictionary } from '@ngrx/entity';
import { map, startWith } from 'rxjs/operators';
import { getTestsFromProductUseCases, getUseCasesForProductVersion } from '../../../helpers';
import { Test, TestResult } from '../../../store/test/test.interfaces';
import { getTestsDict } from '../../../store/test/test.selectors';
import { ChartData } from '../../charts/models';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CustomerDisplayService],
})
export class CustomerDashboardComponent implements OnInit {
  public customer$: Observable<Customer>;

  public loading$: Observable<boolean>;

  public products$: Observable<Dictionary<Product>>;

  public testDict$: Observable<Dictionary<Test>>;

  constructor(private customerDisplayService: CustomerDisplayService, private store: Store) {}

  ngOnInit(): void {
    this.customerDisplayService.init();

    this.customer$ = this.customerDisplayService.customer$;
    this.loading$ = this.customerDisplayService.loading$;

    this.products$ = this.store.pipe(select(getProductDict));

    this.testDict$ = this.store.pipe(select(getTestsDict));
  }

  getChartData(customerId: string, envId: string, productId: string, productVersion: string): Observable<ChartData[]> {
    const useCases$ = this.store.pipe(
      select(getUseCasesForProduct(productId)),
      map(useCases => getUseCasesForProductVersion(useCases, productVersion)),
    );

    return combineLatest([useCases$, this.testDict$]).pipe(
      map(([useCases, testDict]) => getTestsFromProductUseCases(useCases, customerId, envId, testDict)),
      map(tests => {
        let passed = 0;
        let failed = 0;
        let waiting = 0;

        for (const test of tests) {
          switch (test.result) {
            case TestResult.failed:
              failed++;
              break;
            case TestResult.passed:
              passed++;
              break;
            default:
              waiting++;
              break;
          }
        }

        return [
          {
            name: 'Passed',
            count: passed,
            color: 'lime',
          },
          {
            name: 'Failed',
            count: failed,
            color: 'red',
          },
          {
            name: 'Waiting',
            count: waiting,
            color: 'rgba(0,0,0,0.55)',
          },
        ];
      }),
    );
  }

  public trackByProduct(index: number, product: CustomerProduct) {
    return product.productId;
  }

  public trackByEnvironment(index: number, env: CustomerEnvironment) {
    return env.id;
  }
}
