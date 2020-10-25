import { Injectable } from '@angular/core';
import { CustomerDisplayService } from './customer-display.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, NEVER, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerEnvironment } from '../store/customer/customer.interfaces';

@Injectable()
export class CustomerEnvironmentDisplayService {
  public environment$: Observable<CustomerEnvironment>;

  constructor(
    private customerDisplayService: CustomerDisplayService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  private initialized = false;

  public init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    this.customerDisplayService.init();

    const environmentId$ = this.route.paramMap.pipe(map(params => params.get('environmentId')!));

    this.environment$ = combineLatest([this.customerDisplayService.customer$, environmentId$]).pipe(
      switchMap(([customer, environmentId]) => {
        const environment = customer.environments.find(env => env.id === environmentId);

        if (!environment) {
          this.snackBar.open('Environment not found, going back up to customer', '', { duration: 5000 });
          this.router.navigate(['customer', customer.id]);
          return NEVER;
        }

        return of(environment);
      }),
    );
  }
}
