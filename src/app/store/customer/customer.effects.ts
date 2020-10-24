import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { applyCustomerChanges, deleteCustomer, loadCustomers, updatedUsedProductVersions } from './customer.actions';
import { concatMap, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Customer } from './customer.interfaces';
import { toFirebaseChange } from '../../helpers';
import { AppFirestoreService } from '../../services/app-firestore.service';
import { select, Store } from '@ngrx/store';
import { getAllCustomers } from './customer.selectors';
import { NEVER } from 'rxjs';

// noinspection JSUnusedGlobalSymbols
@Injectable()
export class CustomerEffects {
  updateUsedProductVersions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updatedUsedProductVersions),
        withLatestFrom(this.store.pipe(select(getAllCustomers))),
        switchMap(([changes, customers]) => {
          const changedCustomers: Customer[] = [];

          for (const customer of customers) {
            let hadChange = false;
            const updated: Customer = {
              ...customer,
              environments: customer.environments.map(environment => {
                return {
                  ...environment,
                  product: environment.products.map(product => {
                    if (product.productId === changes.productId) {
                      for (const changedVersion of changes.changedVersions) {
                        if (changedVersion.from === product.version) {
                          hadChange = true;
                          return {
                            ...product,
                            version: changedVersion.to,
                          };
                        }
                      }
                    }
                    return product;
                  }),
                };
              }),
            };
            if (hadChange) {
              changedCustomers.push(updated);
            }
          }

          if (!changedCustomers.length) {
            return NEVER;
          }

          const promises = changedCustomers.map(c => this.customerCollection.doc(c.id).set(c));

          return Promise.all(promises);
        }),
      ),
    { dispatch: false },
  );

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

  constructor(private actions$: Actions, private firestore: AppFirestoreService, private store: Store) {
    this.customerCollection = this.firestore.customerCollection;
  }
}
