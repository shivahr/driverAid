import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage-provider';

import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public schedule: any;
  aboutPage = AboutPage;

  constructor(public navCtrl: NavController, public storage: StorageProvider, private events: Events) {
    this.loadSchedule();
    events.subscribe('schedule:updated', (userEventData) => {
      console.log('schedule:updated event received');
      this.loadSchedule();
    });
  }

  loadSchedule() {
    this.storage.getSchedule().then(data => {
      this.schedule = data;
      this.schedule = this.schedule.filter((item) => {
        return item.chauffeur === 'Britney Lee';
      })
    });
  }

}
