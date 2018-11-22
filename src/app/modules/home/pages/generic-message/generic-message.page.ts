import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-generic-message',
  templateUrl: 'generic-message.page.html',
})
export class GenericMessagePage {

  genericMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.genericMessage = this.navParams.get('message');
  }

}
