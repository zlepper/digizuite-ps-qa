import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, NEVER, Observable, of } from 'rxjs';
import { Customer } from '../../store/customer/customer.interfaces';
import { filter, map, switchMap } from 'rxjs/operators';
import { getCustomer, isLoadingCustomers } from '../../store/customer/customer.selectors';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDashboardComponent implements OnInit {
  public customer$: Observable<Customer>;

  public loading$: Observable<boolean>;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    const loadingCustomer = this.store.pipe(select(isLoadingCustomers));

    this.loading$ = loadingCustomer;

    const customerId = this.route.paramMap.pipe(map(params => params.get('customerId')!));

    const customerObs = customerId.pipe(switchMap(id => this.store.pipe(select(getCustomer(id)))));

    this.customer$ = combineLatest([customerObs, loadingCustomer]).pipe(
      filter(([, loading]) => !loading),
      switchMap(([customer]) => {
        if (!customer) {
          this.router.navigate(['/']);
          return NEVER;
        }

        return of(customer);
      }),
    );
  }
}
