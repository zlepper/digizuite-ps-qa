import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../store/customer/customer.interfaces';
import { CustomerDisplayService } from '../../../services/customer-display.service';

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

  constructor(private customerDisplayService: CustomerDisplayService) {
  }

  ngOnInit(): void {
    this.customerDisplayService.init();

    this.customer$ = this.customerDisplayService.customer$;
    this.loading$ = this.customerDisplayService.loading$;
  }
}
