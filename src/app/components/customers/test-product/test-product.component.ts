import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CustomerDisplayService } from '../../../services/customer-display.service';
import { ProductDisplayService } from '../../../services/product-display.service';
import { CustomerEnvironmentDisplayService } from '../../../services/customer-environment-display.service';
import { combineLatest, NEVER, Observable, of } from 'rxjs';
import { Customer, CustomerEnvironment } from '../../../store/customer/customer.interfaces';
import { Product, ProductUseCase } from '../../../store/product/product.interfaces';
import { select, Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { getUseCasesForProduct } from '../../../store/product/product.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Version } from '../../../helpers';

@Component({
  selector: 'app-test-product',
  templateUrl: './test-product.component.html',
  styleUrls: ['./test-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CustomerDisplayService, ProductDisplayService, CustomerEnvironmentDisplayService],
})
export class TestProductComponent implements OnInit {
  public customer$: Observable<Customer>;
  public environment$: Observable<CustomerEnvironment>;
  public product$: Observable<Product>;
  public useCases$: Observable<ProductUseCase[]>;

  constructor(
    private customerDisplayService: CustomerDisplayService,
    private productDisplayService: ProductDisplayService,
    private customerEnvironmentDisplayService: CustomerEnvironmentDisplayService,
    private store: Store,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
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

        const selectedVersion = new Version(version);

        const matchingCases = useCases.filter(uc => {
          if (uc.fromVersion) {
            const fw = new Version(uc.fromVersion);

            if (fw.greaterThan(selectedVersion)) {
              return false;
            }
          }

          if (uc.toVersion) {
            const tw = new Version(uc.toVersion);

            if (tw.lessThan(selectedVersion)) {
              return false;
            }
          }

          return true;
        });

        return of(matchingCases);
      }),
    );
  }
}
