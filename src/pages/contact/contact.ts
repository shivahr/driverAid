import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage-provider';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public people: any;

  constructor(public navCtrl: NavController, public storage: StorageProvider, private events: Events) {
    this.loadPeople();
    events.subscribe('employees:updated', (userEventData) => {
      console.log('employees:updated event received');
      this.loadPeople();
    });
  }

  loadPeople(){
    this.storage.getEmployees().then(data => {
      this.people = data;
    });
  }
}
