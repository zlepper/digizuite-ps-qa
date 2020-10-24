import { createAction, props } from '@ngrx/store';
import { FirebaseChange } from '../../helpers';
import { Product, ProductUseCase } from './product.interfaces';

export const applyProductChanges = createAction('[product] apply changes', props<{ changes: FirebaseChange<Product>[] }>());
export const applyProductUseCaseChanges = createAction(
  '[product] apply use case changes',
  props<{ changes: FirebaseChange<ProductUseCase>[] }>(),
);

export const loadProduct = createAction('[product] load');
