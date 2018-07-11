import { Leg } from './../../models/leg';
import { PncHomePage } from './../pnc-home/pnc-home';
import { LegProvider } from './../../providers/leg/leg';
import { GenderProvider } from './../../providers/gender/gender';
import { PncProvider } from './../../providers/pnc/pnc';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CrewMember } from '../../models/crewMember';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-flight-crew-list',
  templateUrl: 'flight-crew-list.html',
})
export class FlightCrewListPage {

  flightCrewList: CrewMember[];
  leg: Leg;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private legProvider: LegProvider,
    private translate: TranslateService) {
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
