/// <reference path="../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
/// <reference path="../../plugins/cordova-plugin-mfp-jsonstore/typings/jsonstore.d.ts" />
import { Injectable } from '@angular/core';

@Injectable()
export class StorageProvider {
  employeesCollectionName = 'employees';
  userCredentialsCollectionName = 'userCredentials';
  collections = {
    employees: {
      searchFields: {email: 'string'}
    },
    userCredentials: {
      searchFields: {username: 'string'}
    }
  }

  constructor() {}

  init(username, password) {
    console.log('--> JSONStore init called');

    let authData = {
      username: username,
      password: password,
      localKeyGen: true
    }

    WL.JSONStore.closeAll({});
    WL.JSONStore.init(this.collections, authData)
    .then(
      (success) => {
        console.log('--> JSONStore init success');
        WL.JSONStore.get(this.userCredentialsCollectionName).count({}, {})
        .then(
          (countResult) => {
            if (countResult == 0) {
              // The JSONStore collection is empty, populate it.
              WL.JSONStore.get(this.userCredentialsCollectionName).add(authData, {});
              console.log('--> JSONStore collection populated with user-credentials')
            }
            this.loadDataFromAdapter();
          }
        )
      }
    )
  }

  offlineLogin(username, password, loginSuccessCallback, loginFailureCallback) {
    console.log('--> offlineLogin called');

    let authData = {
      username: username,
      password: password,
      localKeyGen: true
    }

    WL.JSONStore.closeAll({});
    WL.JSONStore.init(this.collections, authData)
    .then(
      (success) => {
        WL.JSONStore.get(this.userCredentialsCollectionName).count({}, {})
        .then(
          (countResult) => {
            if (countResult == 0) {
              // 'First time login must be done when Internet connection is available.'
              WL.JSONStore.destroy(username);
              console.log('--> offlineLogin failed - First time login must be done when Internet connection is available')
              loginFailureCallback({'failure': 'First time login must be done when Internet connection is available'});
            } else {
              console.log('--> offlineLogin success')
              loginSuccessCallback();
            }
          }
        )
      },
      (failure) => {
        console.log('--> offlineLogin failed - invalid username/password ', failure)
        loginFailureCallback({'failure': 'invalid username/password'});
      }
    )
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
    let options = {
      replaceCriteria: ['email'],
      addNew: true,
      markDirty: false
    };

    WL.JSONStore.get(this.employeesCollectionName).change(data, options).then((success) => {
      console.log('--> JSONStore putEmployees success')
    }, (failure) => {
      console.log('--> JSONStore putEmployees failed', failure)
    })
  }

  getEmployees() {
    console.log('--> JSONStore getEmployees function called');

    return new Promise( resolve => {
      let options = {};

      WL.JSONStore.get(this.employeesCollectionName).findAll(options).then((success) => {
        console.log('--> JSONStore getEmployees success', success)
        resolve(success);
      }, (failure) => {
        console.log('--> JSONStore getEmployees failed', failure)
        resolve('error');
      })
    })
  }
}
