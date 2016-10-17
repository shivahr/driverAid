import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  form;
  isChallenged = false;
  securityCheckName = 'LDAPLogin';
  userLoginChallengeHandler;
  statusMsg;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    this.AuthInit();

    this.form = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required)
    });
  }

  AuthInit() {
    // Reference: https://github.com/MobileFirst-Platform-Developer-Center/PreemptiveLoginCordova/blob/release80/www/js/UserLoginChallengeHandler.js
    this.userLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler(this.securityCheckName);

    this.userLoginChallengeHandler.handleChallenge = function(challenge) {
        console.log('--> handleChallenge called');
        this.isChallenged = true;
        this.statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
        if (challenge.errorMsg !== null){
            this.statusMsg += "<br/>" + challenge.errorMsg;
        }
        // this.showLoginPage();
    };

    this.userLoginChallengeHandler.handleSuccess = function(data) {
        console.log('--> handleSuccess called');
        this.isChallenged = false;
        // document.getElementById('username').value = "";
        // document.getElementById('password').value = "";
        // document.getElementById("helloUser").innerHTML = "Hello, " + data.user.displayName;
        this.showTabsPage();
    };

    this.userLoginChallengeHandler.handleFailure = function(error) {
        console.log('--> handleFailure called' + error.failure);
        this.isChallenged = false;
        if (error.failure !== null){
            alert(error.failure);
        } else {
            alert("Failed to login.");
        }
    };
  }

  processForm() {
    // Reference: https://github.com/driftyco/ionic-preview-app/blob/master/src/pages/inputs/basic/pages.ts
    let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "" || password === "") {
        alert('Username and password are required');
        return;
    }

    // Reference: https://github.com/MobileFirst-Platform-Developer-Center/PreemptiveLoginCordova/blob/release80/www/js/UserLoginChallengeHandler.js
    if (this.isChallenged){
        this.userLoginChallengeHandler.submitChallengeAnswer({'username':username, 'password':password});
    } else {
        WLAuthorizationManager.login(this.securityCheckName,{'username':username, 'password':password})
        .then((success) => {
            console.log('--> login success');
          }, (failure) => {
            console.log('--> login onFailure: ' + JSON.stringify(failure));
          }
        );
    }

  }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

  // Reference: http://www.joshmorony.com/a-simple-guide-to-navigation-in-ionic-2/
  showLoginPage() {
    this.navCtrl.setRoot(Login);
  }

  showTabsPage() {
    this.navCtrl.setRoot(TabsPage);
  }

}
