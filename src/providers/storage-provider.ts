/// <reference path="../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
/// <reference path="../../plugins/cordova-plugin-mfp-jsonstore/typings/jsonstore.d.ts" />
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class StorageProvider {
  employeesCollectionName = 'employees';
  scheduleCollectionName = 'schedule';
  userCredentialsCollectionName = 'userCredentials';
  collections = {
    employees: {
      searchFields: {email: 'string'}
    },
    schedule: {
      searchFields: {naam: 'string'}
    },
    userCredentials: {
      searchFields: {username: 'string'}
    }
  }

  constructor(public events: Events) {}

  init(username, password) {
    console.log('--> JSONStore init called');

    let authData = {
      username: username,
      password: password,
      localKeyGen: true
    }

    return new Promise( resolve => {
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
          resolve('success');
        }
      )
    })
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
    dataRequest.send().
    then(
      (response) => {
        console.log('--> employees data loaded from adapter', response);
        console.log('--> putting employees data to JSONStore');
        this.putEmployees(response.responseJSON.rows);
      },
      (failure) => {
        console.log('--> failed to load employees data from adapter', failure);
      }
    )
    dataRequest = new WLResourceRequest("/adapters/employeeAdapter/getSchedule", WLResourceRequest.GET);
    dataRequest.send()
    .then(
      (response) => {
        console.log('--> schedule data loaded from adapter', response);
        console.log('--> putting schedule data to JSONStore');
        this.putSchedule(response.responseJSON.rows);
      },
      (failure) => {
        console.log('--> failed to load schedule data from adapter', failure);
      }
    )
  }

  putEmployees(data){
    console.log('--> JSONStore putEmployees function called');
    this.sortEmployees(data);
    let options = {
      replaceCriteria: ['email'],
      addNew: true,
      markDirty: false
    };

    WL.JSONStore.get(this.employeesCollectionName).change(data, options).then((success) => {
      console.log('--> JSONStore putEmployees success')
      this.events.publish('employees:updated', true);
    }, (failure) => {
      console.log('--> JSONStore putEmployees failed', failure)
    })
  }

  sortEmployees(data) {
    data.sort(
      function(a, b) {
        if (a.name.first < b.name.first) {
          return -1;
        }
        if (a.name.first > b.name.first) {
          return 1;
        }
        if (a.name.last < b.name.last) {
          return -1;
        }
        if (a.name.last > b.name.last) {
          return 1;
        }
        return 0;
      }
    )
  }

  putSchedule(data){
    console.log('--> JSONStore putSchedule function called');
    this.sortSchedule(data);
    let options = {
      replaceCriteria: ['naam'],
      addNew: true,
      markDirty: false
    };

    WL.JSONStore.get(this.scheduleCollectionName).change(data, options).then((success) => {
      console.log('--> JSONStore putSchedule success')
      this.events.publish('schedule:updated', true);
    }, (failure) => {
      console.log('--> JSONStore putSchedule failed', failure)
    })
  }

  sortSchedule(data) {
    data.sort(
      function(a, b) {
        if (a.chauffeur < b.chauffeur) {
          return -1;
        }
        if (a.chauffeur > b.chauffeur) {
          return 1;
        }
        if (a.datum < b.datum) {
          return -1;
        }
        if (a.datum > b.datum) {
          return 1;
        }
        if (a.start < b.start) {
          return -1;
        }
        if (a.start > b.start) {
          return 1;
        }
        return 0;
      }
    )
  }

  getEmployees() {
    console.log('--> JSONStore getEmployees function called');

    return new Promise( resolve => {
      let options = {};
      WL.JSONStore.get(this.employeesCollectionName).findAll(options)
      .then(
        (data) => {
          data = data.map((item) => {
            return item.json;
          })
          console.log('--> JSONStore getEmployees success', data)
          resolve(data);
        },
        (failure) => {
          console.log('--> JSONStore getEmployees failed', failure)
          resolve('error');
        }
      )
    })
  }

  getSchedule() {
    console.log('--> JSONStore getSchedule function called');

    return new Promise( resolve => {
      let options = {};
      WL.JSONStore.get(this.scheduleCollectionName).findAll(options)
      .then(
        (data) => {
          data = data.map((item) => {
            return item.json;
          })
          console.log('--> JSONStore getSchedule success', data)
          resolve(data);
        },
        (failure) => {
          console.log('--> JSONStore getSchedule failed', failure)
          resolve('error');
        }
      )
    })
  }
}
