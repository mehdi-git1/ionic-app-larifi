import { Leg } from './../../models/leg';
import { PncHomePage } from './../pnc-home/pnc-home';
import { LegProvider } from './../../providers/leg/leg';
import { GenderProvider } from './../../providers/gender/gender';
import { PncProvider } from './../../providers/pnc/pnc';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CrewMember } from '../../models/CrewMember';

@Component({
  selector: 'page-flight-crew-list',
  templateUrl: 'flight-crew-list.html',
})
export class FlightCrewListPage {

  flightCrewList: any[];
  leg: Leg;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private legProvider: LegProvider,
    private genderProvider: GenderProvider) {
  }

  ionViewCanEnter() {
    this.leg = this.navParams.get('leg');
    this.legProvider.getFlightCrewFromLeg(this.leg.techId).then(flightCrew => {
      this.flightCrewList = flightCrew;
    }, error => {
    });
  }

  openPncHomePage(matricule) {
    this.navCtrl.push(PncHomePage, { matricule: matricule });
  }

}
