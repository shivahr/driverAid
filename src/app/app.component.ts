import { Component, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { AuthHandler } from '../providers/auth-handler';
import { StorageProvider } from '../providers/storage-provider';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
rootPage: any;

  constructor(platform: Platform, renderer: Renderer,
    private authHandler: AuthHandler, private storage: StorageProvider) {

    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      console.log('--> MFP API init complete');
      this.MFPInitComplete();
    })

    renderer.listenGlobal('document', 'mfpjsonjsloaded', () => {
      // console.log('--> MFP JSONStore API init complete');
      // this.storage.init();
    })

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    })
  }

  MFPInitComplete() {
    console.log('--> MFPInitComplete() function called');
    this.authHandler.init();

    this.rootPage = Login;
    // this.authHandler.checkIsLoggedIn();
  }

}
