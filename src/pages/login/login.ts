import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';

var navController: any;
var alertController: any;
var isChallenged = false;
var statusMsg;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  form;
  securityCheckName = 'LDAPLogin';
  userLoginChallengeHandler;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    navController = navCtrl;
    alertController = alertCtrl;

    this.AuthInit();

    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }

  AuthInit() {
    // Reference: https://github.com/MobileFirst-Platform-Developer-Center/PreemptiveLoginCordova/blob/release80/www/js/UserLoginChallengeHandler.js
    this.userLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler(this.securityCheckName);

    this.userLoginChallengeHandler.handleChallenge = function(challenge) {
        console.log('--> handleChallenge called');
        isChallenged = true;
        statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
        if (challenge.errorMsg !== null){
            statusMsg += "<br/>" + challenge.errorMsg;
        }

        // Reference: http://www.joshmorony.com/a-simple-guide-to-navigation-in-ionic-2/
        navController.setRoot(Login);
    };

    this.userLoginChallengeHandler.handleSuccess = function(data) {
        console.log('--> handleSuccess called');
        isChallenged = false;

        console.log('--> this: ', this);
        console.log('--> navController:', navController);
        // Reference: http://www.joshmorony.com/a-simple-guide-to-navigation-in-ionic-2/
        navController.setRoot(TabsPage);
    };

    this.userLoginChallengeHandler.handleFailure = function(error) {
        console.log('--> handleFailure called' + error.failure);
        isChallenged = false;
        if (error.failure !== null){
            showAlert(error.failure);
        } else {
            showAlert("Failed to login.");
        }
    };
  }

  processForm() {
    // Reference: https://github.com/driftyco/ionic-preview-app/blob/master/src/pages/inputs/basic/pages.ts
    let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "" || password === "") {
        showAlert('Username and password are required');
        return;
    }
    console.log('--> Sign-in with user: ', username);
    console.log('--> isChallenged: ', isChallenged);

    // Reference: https://github.com/MobileFirst-Platform-Developer-Center/PreemptiveLoginCordova/blob/release80/www/js/UserLoginChallengeHandler.js
    if (isChallenged){
        this.userLoginChallengeHandler.submitChallengeAnswer({'username':username, 'password':password});
    } else {
        WLAuthorizationManager.login(this.securityCheckName,{'username':username, 'password':password})
        .then((success) => {
            console.log('--> login success');
          }, (failure) => {
            console.log('--> login failure: ' + JSON.stringify(failure));
          }
        );
    }

  }

  ionViewDidLoad() {
    console.log('--> Login Page - ionViewDidLoad called');
  }

}

function showAlert(alertMessage) {
  let prompt = alertController.create({
    title: 'Login Failure',
    message: alertMessage,
    buttons: [
      {
        text: 'Ok',
      }
    ]
  });
  prompt.present();
}
