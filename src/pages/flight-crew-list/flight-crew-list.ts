import { SessionService } from './../../services/session.service';
import { Leg } from './../../models/leg';
import { PncHomePage } from './../pnc-home/pnc-home';
import { LegProvider } from './../../providers/leg/leg';
import { GenderProvider } from './../../providers/gender/gender';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CrewMember } from '../../models/CrewMember';

@Component({
  selector: 'page-flight-crew-list',
  templateUrl: 'flight-crew-list.html',
})
export class FlightCrewListPage {

  flightCrewList: CrewMember[];
  leg: Leg;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public genderProvider: GenderProvider,
    private legProvider: LegProvider,
    private sessionService: SessionService) {
  }

  ionViewCanEnter() {
    this.leg = this.navParams.get('leg');
    this.legProvider.getFlightCrewFromLeg(this.leg.techId).then(flightCrew => {
      this.flightCrewList = flightCrew;
      flightCrew.forEach(crew => {
        if (crew.pnc.matricule === this.sessionService.authenticatedUser.matricule) {
          this.sessionService.appContext.onBoardRedactorFonction = crew.onBoardFonction;
        }
      });
    }, error => {
    });
  }

  openPncHomePage(matricule, onBoardFonction) {
    this.sessionService.appContext.observedPncMatricule = matricule;
    this.sessionService.appContext.onBoardObservedPncFonction = onBoardFonction;
    this.navCtrl.push(PncHomePage);
  }

}
