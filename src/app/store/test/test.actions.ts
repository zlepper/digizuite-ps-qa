import { createAction, props } from '@ngrx/store';
import { FirebaseChange } from '../../helpers';
import { Test } from './test.interfaces';

export const loadTests = createAction('[test-result] load');

export const applyTestChanges = createAction('[test-result] apply changes', props<{changes: FirebaseChange<Test>[]}>());

