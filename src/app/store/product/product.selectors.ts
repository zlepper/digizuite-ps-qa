import { createFeatureSelector, createSelector } from '@ngrx/store';
import { productAdapter, productFeatureKey, ProductState, productUseCaseAdapter } from './product.interfaces';

const productFeatureState = createFeatureSelector<ProductState>(productFeatureKey);

const { selectAll: selectAllProducts, selectEntities: selectProductEntities } = productAdapter.getSelectors();
const {selectAll: selectAllUseCases} = productUseCaseAdapter.getSelectors();

const productState = createSelector(productFeatureState, state => state.products);

export const getAllProducts = createSelector(productState, state => selectAllProducts(state));

export const getProductDict = createSelector(productState, state => selectProductEntities(state));

export function getProduct(id: string) {
  return createSelector(getProductDict, dict => dict[id]);
}

const getUseCasesState = createSelector(productFeatureState, state => state.useCases);

const getAllUseCases = createSelector(getUseCasesState, state => selectAllUseCases(state));

export function getUseCasesForProduct(productId: string) {
  return createSelector(getAllUseCases, cases => cases.filter(c => c.productId === productId));
}

export const isLoadingProducts = createSelector(productFeatureState, state => state.loadingProducts);
export const isLoadingUseCases = createSelector(productFeatureState, state => state.loadingUseCases);
