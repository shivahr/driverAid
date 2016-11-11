/// <reference path="../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
/// <reference path="../../plugins/cordova-plugin-mfp-jsonstore/typings/jsonstore.d.ts" />
import { Injectable } from '@angular/core';

@Injectable()
export class StorageProvider {

  constructor() {}

  init() {
    console.log('--> JSONStore init function called');

    let collections = {
      employees: {
        searchFields: {email: 'string'}
      }
    }

    WL.JSONStore.init(collections).then((success) => {
      console.log('--> JSONStore init success')
      this.loadDataFromAdapter();
    }, (failure) => {
      console.log('--> JSONStore init failed', failure)
    })
  }

  loadDataFromAdapter() {
    console.log('--> called loadDataFromAdapter');
    let dataRequest = new WLResourceRequest("/adapters/employeeAdapter/getEmployees", WLResourceRequest.GET);
    dataRequest.send().then(
      (response) => {
        console.log('--> data loaded from adapter', response);
        console.log('--> putting data to JSONStore');
        this.putEmployees(response.responseJSON.rows);
      }, (failure) => {
        console.log('--> failed to load data from adapter', failure);
      })
  }

  putEmployees(data){
    console.log('--> JSONStore putEmployees function called');
    let collectionName = 'employees';
    let options = {
      replaceCriteria: ['email'],
      addNew: true,
      markDirty: false
    };

    WL.JSONStore.get(collectionName).change(data, options).then((success) => {
      console.log('--> JSONStore putEmployees success')
    }, (failure) => {
      console.log('--> JSONStore putEmployees failed', failure)
    })
  }

  getEmployees() {
    console.log('--> JSONStore getEmployees function called');

    return new Promise( resolve => {
      let collectionName = 'employees';
      let options = {};

      WL.JSONStore.get(collectionName).findAll(options).then((success) => {
        console.log('--> JSONStore getEmployees success', success)
        resolve(success);
      }, (failure) => {
        console.log('--> JSONStore getEmployees failed', failure)
        resolve('error');
      })
    })
  }
}
