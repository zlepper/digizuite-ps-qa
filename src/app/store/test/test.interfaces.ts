import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const testFeatureKey = 'tests';

export enum TestResult {
  notRun = 'not-run',
  passed = 'passed',
  failed = 'failed',
}

export interface Test {
  id: string;
  customerId: string;
  environmentId: string;
  productId: string;
  useCaseId: string;
  result: TestResult;
}

export const testAdapter = createEntityAdapter<Test>({
  selectId: test => test.id,
});

export interface TestState {
  loading: boolean;
  tests: EntityState<Test>;
}

export const initialTestState: TestState = {
  loading: true,
  tests: testAdapter.getInitialState()
};
