import { createReducer, on } from '@ngrx/store';
import { initialTestState, testAdapter } from './test.interfaces';
import { applyTestChanges } from './test.actions';
import { getUpdatedState } from '../../helpers';

export const testReducer = createReducer(
  initialTestState,

  on(applyTestChanges, (state, { changes }) => ({
    ...state,
    loading: false,
    tests: getUpdatedState(changes, state.tests, testAdapter),
  })),
);
