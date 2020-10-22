import { createReducer, on } from '@ngrx/store';
import { customerAdapter, initialCustomerState } from './customer.interfaces';
import { applyCustomerChanges } from './customer.actions';
import { includeId } from '../../helpers';

export const customerReducer = createReducer(
  initialCustomerState,

  on(applyCustomerChanges, (state, { changes }) => {
    const upserts = changes.filter(c => c.type === 'added' || c.type === 'modified').map(c => c.document);
    const removes = changes.filter(c => c.type === 'removed').map(c => c.document.id);

    let customers = customerAdapter.upsertMany(upserts, state.customers);
    customers = customerAdapter.removeMany(removes, customers);

    return {
      ...state,
      customers,
    };
  }),
);
