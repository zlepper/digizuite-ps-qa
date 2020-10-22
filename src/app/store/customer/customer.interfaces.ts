import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface Customer {
  name: string;
  id: string;
}

export const customerAdapter = createEntityAdapter<Customer>({
  selectId(customer): string {
    return customer.id;
  },
  sortComparer(a, b): number {
    return a.name.localeCompare(b.name);
  },
});

export interface CustomerState {
  customers: EntityState<Customer>;
  loading: boolean;
}

export const initialCustomerState: CustomerState = {
  customers: customerAdapter.getInitialState(),
  loading: true,
};
