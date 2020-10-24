import { createFeatureSelector, createSelector } from '@ngrx/store';
import { customerAdapter, CustomerState } from './customer.interfaces';

const { selectAll, selectEntities } = customerAdapter.getSelectors();

const getState = createFeatureSelector<CustomerState>('customer');

const getCustomerState = createSelector(getState, state => state.customers);
export const getAllCustomers = createSelector(getCustomerState, state => selectAll(state));

const getCustomerDict = createSelector(getCustomerState, state => selectEntities(state));

export function getCustomer(id: string) {
  return createSelector(getCustomerDict, dict => dict[id]);
}

export const isLoadingCustomers = createSelector(getState, state => state.loading);
