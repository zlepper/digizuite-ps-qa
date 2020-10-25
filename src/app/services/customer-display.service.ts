import { Injectable, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, NEVER, Observable, of } from 'rxjs';
import { Customer } from '../store/customer/customer.interfaces';
import { getCustomer, isLoadingCustomers } from '../store/customer/customer.selectors';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomerDisplayService {
  public customer$: Observable<Customer>;

  public loading$: Observable<boolean>;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  private initialized = false;

  public init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    const loadingCustomer = this.store.pipe(select(isLoadingCustomers));

    this.loading$ = loadingCustomer;

    const customerId = this.route.paramMap.pipe(map(params => params.get('customerId')!));

    const customerObs = customerId.pipe(switchMap(id => this.store.pipe(select(getCustomer(id)))));

    this.customer$ = combineLatest([customerObs, loadingCustomer]).pipe(
      filter(([, loading]) => !loading),
      switchMap(([customer]) => {
        if (!customer) {
          this.snackBar.open('Cannot find customer, going back to frontpage', '', { duration: 5000 });
          this.router.navigate(['/']);
          return NEVER;
        }

        return of(customer);
      }),
    );
  }
}
