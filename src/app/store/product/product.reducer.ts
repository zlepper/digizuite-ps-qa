import { createReducer, on } from '@ngrx/store';
import { initialProductState, productAdapter } from './product.interfaces';
import { applyProductChanges } from './product.actions';
import { getUpdatedState } from '../../helpers';

export const productReducer = createReducer(
  initialProductState,

  on(applyProductChanges, (state, { changes }) => ({
    ...state,
    loading: false,
    products: getUpdatedState(changes, state.products, productAdapter),
  })),
);
