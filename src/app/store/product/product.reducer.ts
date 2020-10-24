import { createReducer, on } from '@ngrx/store';
import { initialProductState, productAdapter, productUseCaseAdapter } from './product.interfaces';
import { applyProductChanges, applyProductUseCaseChanges } from './product.actions';
import { getUpdatedState } from '../../helpers';

export const productReducer = createReducer(
  initialProductState,

  on(applyProductChanges, (state, { changes }) => ({
    ...state,
    loadingProducts: false,
    products: getUpdatedState(changes, state.products, productAdapter),
  })),

  on(applyProductUseCaseChanges, (state, { changes }) => ({
    ...state,
    loadingUseCases: false,
    useCases: getUpdatedState(changes, state.useCases, productUseCaseAdapter),
  })),
);
