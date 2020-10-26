import { Injectable } from '@angular/core';
import { CustomerDisplayService } from './customer-display.service';
import { CustomerEnvironmentDisplayService } from './customer-environment-display.service';
import { ProductDisplayService } from './product-display.service';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { getUseCasesForProduct } from '../store/product/product.selectors';
import { combineLatest, NEVER, Observable, of } from 'rxjs';
import { Customer, CustomerEnvironment } from '../store/customer/customer.interfaces';
import { Product, ProductUseCase } from '../store/product/product.interfaces';
import { getTestsFromProductUseCases, getUseCasesForProductVersion, Version } from '../helpers';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dictionary } from '@ngrx/entity';
import { Test, TestResult } from '../store/test/test.interfaces';
import { getTestsDict } from '../store/test/test.selectors';

@Injectable()
export class TestDisplayService {
  private customer$: Observable<Customer>;
  private environment$: Observable<CustomerEnvironment>;
  private product$: Observable<Product>;
  public useCases$: Observable<ProductUseCase[]>;
  public useCaseDict$: Observable<Dictionary<ProductUseCase>>;
  public tests$: Observable<Test[]>;

  constructor(
    private customerDisplayService: CustomerDisplayService,
    private customerEnvironmentDisplayService: CustomerEnvironmentDisplayService,
    private productDisplayService: ProductDisplayService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store,
  ) {}

  public init() {
    this.customerDisplayService.init();
    this.customerEnvironmentDisplayService.init();
    this.productDisplayService.init();

    this.customer$ = this.customerDisplayService.customer$;
    this.environment$ = this.customerEnvironmentDisplayService.environment$;
    this.product$ = this.productDisplayService.product$;

    const productUseCases$ = this.product$.pipe(switchMap(product => this.store.pipe(select(getUseCasesForProduct(product.id)))));

    this.useCases$ = combineLatest([this.environment$, this.product$, productUseCases$, this.customer$]).pipe(
      switchMap(([environment, product, useCases, customer]) => {
        const version = environment.products.find(p => p.productId === product.id)?.version;

        if (!version) {
          this.snackBar.open(
            `The product ${product.name} is not on the ${environment.name} for ${customer.name}. Going back to customer`,
            '',
            { duration: 5000 },
          );
          this.router.navigate(['customer', customer.id]);
          return NEVER;
        }

        const matchingCases = getUseCasesForProductVersion(useCases, version);

        return of(matchingCases);
      }),
      shareReplay({
        refCount: true,
      }),
    );

    this.useCaseDict$ = this.useCases$.pipe(
      map(useCases => {
        const dict: Dictionary<ProductUseCase> = {};

        for (const useCase of useCases) {
          dict[useCase.id] = useCase;
        }

        return dict;
      }),
    );

    const testDict$ = this.store.pipe(select(getTestsDict));

    this.tests$ = combineLatest([this.customer$, this.environment$, this.useCases$, testDict$]).pipe(
      map(([customer, environment, useCases, testDict]) => {
        return getTestsFromProductUseCases(useCases, customer.id, environment.id, testDict);
      }),
    );
  }
}
