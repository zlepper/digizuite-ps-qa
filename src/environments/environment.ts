// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnvironment } from './IEnvironment';

export const environment: IEnvironment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAhRsBsZkHm6XStc7iCqKRz9S48lH1ri5Y',
    authDomain: 'digizuite-ps-qa-dev.firebaseapp.com',
    databaseURL: 'https://digizuite-ps-qa-dev.firebaseio.com',
    projectId: 'digizuite-ps-qa-dev',
    storageBucket: 'digizuite-ps-qa-dev.appspot.com',
    messagingSenderId: '648604823183',
    appId: '1:648604823183:web:30d511e8be4046051f8afa',
    measurementId: 'G-LLMX8N23ZT',
  },
  activeDirectoryTenantId: '6e80d0d2-c049-4101-ad8d-8fd678b61299',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
