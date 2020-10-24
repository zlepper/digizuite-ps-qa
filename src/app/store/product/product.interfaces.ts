import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const productFeatureKey = 'product';

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
  loading: boolean;
  products: EntityState<Product>;
}

export const initialProductState: ProductState = {
  loading: true,
  products: productAdapter.getInitialState(),
};
