import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { applyProductChanges, applyProductUseCaseChanges, loadProduct } from './product.actions';
import { concatMap, map } from 'rxjs/operators';
import { toFirebaseChange } from '../../helpers';
import { AppFirestoreService } from '../../services/app-firestore.service';

// noinspection JSUnusedGlobalSymbols
@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProduct),
      concatMap(() => this.firestore.productCollection.stateChanges()),
      map(changes => applyProductChanges({ changes: changes.map(c => toFirebaseChange(c.payload)) })),
    ),
  );

  loadUseCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProduct),
      concatMap(() => this.firestore.productUseCaseCollection.stateChanges()),
      map(changes => applyProductUseCaseChanges({ changes: changes.map(c => toFirebaseChange(c.payload)) })),
    ),
  );

  constructor(private actions$: Actions, private firestore: AppFirestoreService) {
  }
}
