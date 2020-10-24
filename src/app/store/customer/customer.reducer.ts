import { createReducer, on } from '@ngrx/store';
import { customerAdapter, initialCustomerState } from './customer.interfaces';
import { applyCustomerChanges } from './customer.actions';
import { getUpdatedState } from '../../helpers';

export const customerReducer = createReducer(
  initialCustomerState,

  on(applyCustomerChanges, (state, { changes }) => ({
    ...state,
    customers: getUpdatedState(changes, state.customers, customerAdapter),
    loading: false,
  })),
);
