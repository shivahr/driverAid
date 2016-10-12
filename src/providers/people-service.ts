/// <reference path="../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
import { Injectable } from '@angular/core';

/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class PeopleService {
  data: any = null;

  constructor() {
    console.log('Hello PeopleService Provider');
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      let dataRequest = new WLResourceRequest("/adapters/employeeAdapter/getEmployees", WLResourceRequest.GET);

      dataRequest.send().then(
        (response) => {
          console.log('--> data loaded from adapter', response);
          this.data = response.responseJSON.rows;
          resolve(this.data)
        }, (failure) => {
          console.log('--> failed to load data', failure);
          resolve('error')
        })
      });
  }

}
