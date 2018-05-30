import { GenderProvider } from './../../providers/gender/gender';
import { PncProvider } from './../../providers/pnc/pnc';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-flight-crew-list',
  templateUrl: 'flight-crew-list.html',
})
export class FlightCrewListPage {

  flightCrewList: Pnc[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private pncProvider: PncProvider,
    private genderProvider: GenderProvider) {
  }

  ionViewDidLoad() {
    this.pncProvider.getAll().then(foundPnc => {
      this.flightCrewList = foundPnc;
    }, error => { });
  }

}
