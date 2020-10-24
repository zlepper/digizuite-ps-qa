import { createFeatureSelector, createSelector } from '@ngrx/store';
import { productAdapter, productFeatureKey, ProductState } from './product.interfaces';

const productFeatureState = createFeatureSelector<ProductState>(productFeatureKey);

const { selectAll, selectEntities } = productAdapter.getSelectors();

const productState = createSelector(productFeatureState, state => state.products);

export const getAllProducts = createSelector(productState, state => selectAll(state));

const getProductDict = createSelector(productState, state => selectEntities(state));

export function getProduct(id: string) {
  return createSelector(getProductDict, dict => dict[id]);
}

export const isLoadingProducts = createSelector(productFeatureState, state => state.loading);
