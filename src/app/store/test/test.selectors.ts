import { createFeatureSelector, createSelector } from '@ngrx/store';
import { testAdapter, testFeatureKey, TestState } from './test.interfaces';

const { selectEntities } = testAdapter.getSelectors();

const getTestFeatureState = createFeatureSelector<TestState>(testFeatureKey);

const getTestsState = createSelector(getTestFeatureState, state => state.tests);

export const getTestsDict = createSelector(getTestsState, selectEntities);
