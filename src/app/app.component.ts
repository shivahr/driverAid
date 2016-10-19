import { Component, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { StorageProvider } from '../providers/storage-provider';
import { PeopleService } from '../providers/people-service';
import { AuthHandler } from '../providers/auth-handler';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [StorageProvider, PeopleService]
})
export class MyApp {
rootPage: any;

  constructor(platform: Platform, renderer: Renderer, private storage: StorageProvider, private peopleService: PeopleService, private authHandler: AuthHandler) {
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
    this.authHandler.init();

    this.rootPage = Login;
    // this.authHandler.checkIsLoggedIn();
  }

}
