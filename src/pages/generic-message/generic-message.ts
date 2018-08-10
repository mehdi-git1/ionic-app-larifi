import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-generic-message',
  templateUrl: 'generic-message.html',
})
export class GenericMessagePage {

  genericMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.genericMessage = this.navParams.get('message');
  }

}
