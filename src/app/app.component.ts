import { ChangeDetectionStrategy, Component, isDevMode, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddNewCustomerDialogComponent } from './components/customers/add-new-customer-dialog/add-new-customer-dialog.component';
import { Router } from '@angular/router';
import { Customer } from './store/customer/customer.interfaces';
import { select, Store } from '@ngrx/store';
import { deleteCustomer, loadCustomers } from './store/customer/customer.actions';
import { getAllCustomers } from './store/customer/customer.selectors';
import { ConfirmDeleteDialogComponent } from './components/customers/confirm-delete-dialog/confirm-delete-dialog.component';
import { loadProduct } from './store/product/product.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay(),
  );

  customers$: Observable<Customer[]>;

  user$: Observable<User | null>;

  constructor(
    private fireAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private router: Router,
    private store: Store,
  ) {}

  public login(): void {
    const provider = new auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      tenant: '6e80d0d2-c049-4101-ad8d-8fd678b61299',
    });

    this.fireAuth.signInWithRedirect(provider);
  }

  ngOnInit(): void {
    if (isDevMode() && (window as any).Cypress) {
      (window as any).login = (username: string, password: string) => {
        this.fireAuth.signInWithEmailAndPassword(username, password);
      };
    }

    this.user$ = this.fireAuth.user;

    this.user$.subscribe(u => {
      if (u) {
        this.store.dispatch(loadCustomers());
        this.store.dispatch(loadProduct())
      }
    });

    this.customers$ = this.store.pipe(select(getAllCustomers));
  }

  addNewCustomer(): void {
    this.dialog
      .open(AddNewCustomerDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.router.navigate(['customer', result.id]);
        }
      });
  }

  startDelete(customer: Customer): void {
    this.dialog
      .open(ConfirmDeleteDialogComponent, {
        data: {
          text: `Are you sure you want to delete the customer ${customer.name}? It cannot be recovered afterwards.`,
        },
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.store.dispatch(deleteCustomer({ id: customer.id }));

          const url = this.router.createUrlTree(['customer', customer.id, 'edit']);
          if (this.router.isActive(url, false)) {
            this.router.navigate(['/']);
          }
        }
      });
  }

  logout() {
    this.fireAuth.signOut();
    this.router.navigate(['/']);
  }

  stopPropagation($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
