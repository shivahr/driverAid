import { Component, Renderer } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

import { StorageProvider } from '../providers/storage-provider';
import { PeopleService } from '../providers/people-service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [StorageProvider, PeopleService]
})
export class MyApp {
rootPage: any;
private AuthHandler: any;

  constructor(platform: Platform, renderer: Renderer, private storage: StorageProvider, private peopleService: PeopleService, public alertCtrl: AlertController) {
    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      console.log('--> MFP API init complete');

      this.MFPInitComplete();
    })

    renderer.listenGlobal('document', 'mfpjsonjsloaded', () => {
      console.log('--> MFP JSONStore API init complete');

      this.storage.init();
      this.peopleService.load();
    })

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  MFPInitComplete() {
    console.log('--> MFPInitComplete() function called');
    this.rootPage = TabsPage;

    this.AuthInit();
  }

  AuthInit() {
    this.AuthHandler = WL.Client.createSecurityCheckChallengeHandler('LDAPLogin');
    this.AuthHandler.handleChallenge = ((response) => {
      console.log('--> inside handleChallenge');

      var statusMsg = 'Remaining attempts:' + response.remainingAttempts;
      if (response.errorMsg) {
        statusMsg += "<br/>" + response.errorMsg;
      }
      this.displayLogin(statusMsg);
    })
  }

  displayLogin(statusMsg) {
    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Enter username and password<br>" + statusMsg,
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Login',
          handler: data => {
            console.log('--> trying to authenticate with user', data.username);

            this.AuthHandler.submitChallengeAnswer(data);
          }
        }
      ]
    });
    prompt.present();
  }
}
