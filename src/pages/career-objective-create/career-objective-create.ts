import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-career-objective-create',
  templateUrl: 'career-objective-create.html',
})
export class CareerObjectiveCreatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CareerObjectiveCreatePage');
  }

}
