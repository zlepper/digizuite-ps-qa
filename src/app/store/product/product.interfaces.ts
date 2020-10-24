import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const productFeatureKey = 'product';

export interface ProductUseCase {
  id: string;
  productId: string;
  name: string;
  details: string;
  fromVersion: string|null;
  toVersion: string|null;
}

export const productUseCaseAdapter = createEntityAdapter<ProductUseCase>({
  selectId: useCase => useCase.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export interface ProductVersion {
  version: string;
}

export interface Product {
  id: string;
  name: string;
  versions: ProductVersion[];
}

export const productAdapter = createEntityAdapter<Product>({
  selectId: product => product.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export interface ProductState {
  loadingProducts: boolean;
  loadingUseCases: boolean;
  products: EntityState<Product>;
  useCases: EntityState<ProductUseCase>;
}

export const initialProductState: ProductState = {
  loadingProducts: true,
  loadingUseCases: true,
  products: productAdapter.getInitialState(),
  useCases: productUseCaseAdapter.getInitialState(),
};
