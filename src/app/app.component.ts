import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddNewCustomerDialogComponent } from './components/add-new-customer-dialog/add-new-customer-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer } from './models';
import {sortBy} from 'lodash';
import {Router} from '@angular/router';

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

  constructor(
    private fireAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private firestore: AngularFirestore,
    private router: Router,
  ) {}

  public login(): void {
    const provider = new auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: 'consent',
      tenant: '6e80d0d2-c049-4101-ad8d-8fd678b61299',
    });

    this.fireAuth.signInWithRedirect(provider);
  }

  public logout(): void {
    this.fireAuth.signOut();
  }

  ngOnInit(): void {
    this.fireAuth.user.subscribe(u => {
      console.log(u);
    });

    const customerCollection = this.firestore.collection<Customer>('customers');

    this.customers$ = customerCollection.valueChanges({ idField: 'id' }).pipe(map(customers => {
      return sortBy(customers, 'name');
    }));
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
}
