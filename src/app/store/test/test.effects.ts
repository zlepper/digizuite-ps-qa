import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppFirestoreService } from '../../services/app-firestore.service';
import { applyTestChanges, loadTests } from './test.actions';
import { concatMap, map } from 'rxjs/operators';
import { toFirebaseChange } from '../../helpers';

@Injectable()
export class TestEffects {
  loadTests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTests),
      concatMap(() => this.firestore.testCollection.stateChanges()),
      map(changes => {
          return applyTestChanges({
            changes: changes.map(c =>
              toFirebaseChange(c.payload),
            ),
          });
        },
      ),
    ),
  );

  constructor(private actions$: Actions, private firestore: AppFirestoreService) {}
}
