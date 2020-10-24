import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from './product.interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { applyProductChanges, loadProduct } from './product.actions';
import { concatMap, map } from 'rxjs/operators';
import { toFirebaseChange } from '../../helpers';

// noinspection JSUnusedGlobalSymbols
@Injectable()
export class ProductEffects {
  private productCollection: AngularFirestoreCollection<Product>;

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProduct),
      concatMap(() => this.productCollection.stateChanges()),
      map(changes => applyProductChanges({ changes: changes.map(c => toFirebaseChange(c.payload)) })),
    ),
  );

  constructor(private actions$: Actions, private firestore: AngularFirestore) {
    this.productCollection = this.firestore.collection<Product>('products');
  }
}
