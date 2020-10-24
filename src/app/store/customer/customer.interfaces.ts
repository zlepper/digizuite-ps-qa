import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface CustomerProduct {
  /**
   * The id of the product
   */
  productId: string;
  /**
   * The version of the product
   */
  version: string;
}

export interface CustomerEnvironment {
  /**
   * The name of the environment, fx "test" or "prod"
   */
  name: string;
  /**
   * The products installed on the environment
   */
  products: CustomerProduct[];

  /**
   * The id of the environment
   */
  id: string;
}

export interface Customer {
  /**
   * The name of the customer
   */
  name: string;
  /**
   * The id of the customer, generated by firebase
   */
  id: string;
  /**
   * All the environments the customer has
   */
  environments: CustomerEnvironment[];
}

export const customerAdapter = createEntityAdapter<Customer>({
  selectId(customer: Customer): string {
    return customer.id;
  },
  sortComparer(a: Customer, b: Customer): number {
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
