import {createFeatureSelector, createSelector} from '@ngrx/store';
import {customerAdapter, CustomerState} from './customer.interfaces';

const getState = createFeatureSelector<CustomerState>('customer');

export const getCustomerState = createSelector(getState, state => state.customers);
export const getAllCustomers = createSelector(getCustomerState, state => customerAdapter.getSelectors().selectAll(state));
