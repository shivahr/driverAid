/// <reference path="../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
import { Injectable } from '@angular/core';
import { StorageProvider } from './storage-provider';

@Injectable()
export class PeopleService {
  data: any = null;

  constructor(private storage: StorageProvider) {}

  load() {
    console.log('--> called PeopleService load');
    let dataRequest = new WLResourceRequest("/adapters/employeeAdapter/getEmployees", WLResourceRequest.GET);
    dataRequest.send().then(
      (response) => {
        console.log('--> data loaded from adapter', response);
        this.data = response.responseJSON.rows;
        console.log('--> putting data to JSONStore');
        this.storage.putEmployees(this.data);
      }, (failure) => {
        console.log('--> failed to load data', failure);
      })
  }

}
