import { createAction, props } from '@ngrx/store';
import { Customer } from './customer.interfaces';
import { FirebaseChange } from '../../helpers';

export const applyCustomerChanges = createAction('[customer] apply changes', props<{ changes: FirebaseChange<Customer>[] }>());

export const loadCustomers = createAction('[customer] load');

export const deleteCustomer = createAction('[customer] delete', props<{ id: string }>());

export const updatedUsedProductVersions = createAction(
  '[customer] update used product versions',
  props<{ productId: string; changedVersions: { from: string; to: string }[] }>(),
);
