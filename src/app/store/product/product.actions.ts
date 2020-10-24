import { createAction, props } from '@ngrx/store';
import { FirebaseChange } from '../../helpers';
import { Product } from './product.interfaces';

export const applyProductChanges = createAction('[product] apply changes', props<{changes: FirebaseChange<Product>[]}>());

export const loadProduct = createAction('[product] load');
