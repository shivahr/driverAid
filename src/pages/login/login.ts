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
  navController: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    this.AuthInit();
    this.navController = navCtrl;

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
            this.showAlert(error.failure);
        } else {
            this.showAlert("Failed to login.");
        }
    };
  }

  processForm() {
    // Reference: https://github.com/driftyco/ionic-preview-app/blob/master/src/pages/inputs/basic/pages.ts
    let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "" || password === "") {
        this.showAlert('Username and password are required');
        return;
    }
    console.log('--> Sign-in with user: ', username);
    console.log('--> isChallenged: ', this.isChallenged);

    // Reference: https://github.com/MobileFirst-Platform-Developer-Center/PreemptiveLoginCordova/blob/release80/www/js/UserLoginChallengeHandler.js
    if (this.isChallenged){
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

  // Reference: http://www.joshmorony.com/a-simple-guide-to-navigation-in-ionic-2/
  showLoginPage() {
    this.navController.setRoot(Login);
  }

  showTabsPage() {
    this.navController.setRoot(TabsPage);
  }

  showAlert(alertMessage) {
    let prompt = this.alertCtrl.create({
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

  ionViewDidLoad() {
    console.log('--> Login Page - ionViewDidLoad called');
  }

}
