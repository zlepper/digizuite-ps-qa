import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, NEVER, Observable, of } from 'rxjs';
import { Product, ProductUseCase } from '../store/product/product.interfaces';
import { filter, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { getProduct, getUseCasesForProduct, isLoadingProducts } from '../store/product/product.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ProductDisplayService {
  public loading$: Observable<boolean>;

  public product$: Observable<Product>;

  public useCases$: Observable<ProductUseCase[]>;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  public init() {
    const loadingProduct = this.store.pipe(select(isLoadingProducts));

    this.loading$ = loadingProduct;

    const productId$ = this.route.paramMap.pipe(map(params => params.get('productId')!));

    const productObs = productId$.pipe(switchMap(id => this.store.pipe(select(getProduct(id)))));

    this.product$ = combineLatest([productObs, loadingProduct]).pipe(
      filter(([, loading]) => !loading),
      switchMap(([product]) => {
        if (!product) {
          this.snackBar.open('Cannot find product, navigating to product list', '', { duration: 5000 });
          this.router.navigate(['products']);
          return NEVER;
        }

        return of(product);
      }),
    );

    this.useCases$ = productId$.pipe(switchMap(productId => this.store.pipe(select(getUseCasesForProduct(productId)))));
  }
}
