import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../store/customer/customer.interfaces';
import { CustomerDisplayService } from '../../../services/customer-display.service';
import { Product } from '../../../store/product/product.interfaces';
import { select, Store } from '@ngrx/store';
import { getProductDict } from '../../../store/product/product.selectors';
import { Dictionary } from '@ngrx/entity';

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

  constructor(private customerDisplayService: CustomerDisplayService, private store: Store) {
  }

  ngOnInit(): void {
    this.customerDisplayService.init();

    this.customer$ = this.customerDisplayService.customer$;
    this.loading$ = this.customerDisplayService.loading$;

    this.products$  = this.store.pipe(select(getProductDict));
  }
}
