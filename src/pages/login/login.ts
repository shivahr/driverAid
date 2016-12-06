import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Network } from "ionic-native";

import { TabsPage } from '../tabs/tabs';

import { AuthHandler } from '../../providers/auth-handler';
import { StorageProvider } from '../../providers/storage-provider';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  form;
  username;
  password;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private authHandler: AuthHandler, private storage: StorageProvider) {
    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.authHandler.setCallbacks(
      () =>  {
        this.storage.init(this.username, this.password);
        this.navCtrl.setRoot(TabsPage);
      }, (error) => {
        if (error.failure !== null) {
          this.showAlert('Login Failure', error.failure);
        } else {
          this.showAlert('Login Failure', "Failed to login.");
        }
      }, () => {
        // this.navCtrl.setRoot(Login);
      });
  }

  noConnection() {
    return (Network.connection === 'none');
  }

  checkNetwork() {
    console.log('--> Login Page - checkNetwork called');
    this.showAlert('Connection Status', Network.connection);
  }

  processForm() {
    // Reference: https://github.com/driftyco/ionic-preview-app/blob/master/src/pages/inputs/basic/pages.ts
    let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "" || password === "") {
        this.showAlert('Enter authentication data', 'Username and password are required');
        return;
    }
    if (this.noConnection()) {
      console.log('--> Offline sign-in with user: ', username);
      this.storage.offlineLogin(username, password,
        () => {
          this.navCtrl.setRoot(TabsPage);
        },
        (error) => {
          this.showAlert('Login Failure', error.failure);
        });
    } else {
      console.log('--> Online sign-in with user: ', username);
      this.username = username;
      this.password = password;
      this.authHandler.login(username, password);
    }
  }

  showAlert(alertTitle, alertMessage) {
    let prompt = this.alertCtrl.create({
      title: alertTitle,
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
