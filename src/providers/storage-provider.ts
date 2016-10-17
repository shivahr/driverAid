/// <reference path="../../plugins/cordova-plugin-mfp-jsonstore/typings/jsonstore.d.ts" />
import { Injectable } from '@angular/core';

@Injectable()
export class StorageProvider {
  data: any = null;

  constructor() {}

  init() {
    console.log('--> JSONStore init function called');

    let collections = {
      employees: {
        searchFields: {'login.username': 'string'}
      }
    }

    WL.JSONStore.init(collections).then((success) => {
      console.log('--> JSONStore init success')
    }, (failure) => {
      console.log('--> JSONStore init failed', failure)
    })
  }

  putEmployees(data){
    console.log('--> JSONStore putEmployees function called');
    let collectionName = 'employees';
    let options = {
      replaceCriteria: ['login.username'],
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
