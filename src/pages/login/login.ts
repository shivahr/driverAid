import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';

import { AuthHandler } from '../../providers/auth-handler';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  form;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private authHandler:AuthHandler) {
    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.authHandler.setCallbacks(
      () =>  {
        this.navCtrl.setRoot(TabsPage);
      }, (error) => {
        if (error.failure !== null) {
          this.showAlert(error.failure);
        } else {
          this.showAlert("Failed to login.");
        }
      }, () => {
        // this.navCtrl.setRoot(Login);
      });
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
    this.authHandler.login(username, password);
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
