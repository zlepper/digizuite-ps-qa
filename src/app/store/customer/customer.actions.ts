import { createAction, props } from '@ngrx/store';
import { Customer } from './customer.interfaces';
import {FirebaseChange} from '../../helpers';

export const applyCustomerChanges = createAction('[customer] apply changes', props<{changes: FirebaseChange<Customer>[]}>());

export const loadCustomers = createAction('[customers] load');

