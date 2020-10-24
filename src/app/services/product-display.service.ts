import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, NEVER, Observable, of } from 'rxjs';
import { Product } from '../store/product/product.interfaces';
import { filter, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { getProduct, isLoadingProducts } from '../store/product/product.selectors';

@Injectable({
  providedIn: 'root',
})
export class ProductDisplayService {

  public loading$: Observable<boolean>;

  public product$: Observable<Product>;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
  }

  public init() {
    const loadingProduct = this.store.pipe(select(isLoadingProducts));

    this.loading$ = loadingProduct;

    const productId = this.route.paramMap.pipe(map(params => params.get('productId')!));

    const productObs = productId.pipe(switchMap(id => this.store.pipe(select(getProduct(id)))));

    this.product$ = combineLatest([productObs, loadingProduct]).pipe(
      filter(([, loading]) => !loading),
      switchMap(([product]) => {
        if (!product) {
          this.router.navigate(['products']);
          return NEVER;
        }

        return of(product);
      }),
    );
  }
}
