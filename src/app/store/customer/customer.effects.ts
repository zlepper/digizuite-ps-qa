import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {applyCustomerChanges, loadCustomers} from './customer.actions';
import {concatMap, map} from 'rxjs/operators';
import {Customer} from './customer.interfaces';
import {toFirebaseChange} from '../../helpers';

@Injectable()
export class CustomerEffects {
  private customerCollection: AngularFirestoreCollection<Customer>;
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomers.type),
      concatMap(() => this.customerCollection.stateChanges()),
      map(changes => applyCustomerChanges({changes: changes.map(c => toFirebaseChange(c.payload))})),
    ),
  );

  constructor(private actions$: Actions, private firestore: AngularFirestore) {
    this.customerCollection = this.firestore.collection<Customer>('customers');
  }
}
