import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { applyCustomerChanges, deleteCustomer, loadCustomers } from './customer.actions';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import { Customer } from './customer.interfaces';
import { toFirebaseChange } from '../../helpers';

@Injectable()
export class CustomerEffects {
  private customerCollection: AngularFirestoreCollection<Customer>;
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomers),
      concatMap(() => this.customerCollection.stateChanges()),
      map(changes => applyCustomerChanges({ changes: changes.map(c => toFirebaseChange(c.payload)) })),
    ),
  );

  deleteCustomer$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(deleteCustomer),
        mergeMap(({ id }) => {
          return this.customerCollection.doc(id).delete();
        }),
      );
    },
    { dispatch: false },
  );

  constructor(private actions$: Actions, private firestore: AngularFirestore) {
    this.customerCollection = this.firestore.collection<Customer>('customers');
  }
}
