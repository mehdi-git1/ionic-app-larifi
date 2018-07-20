import { AuthGuard } from './../../guard/auth.guard';
import { SessionService } from './../../services/session.service';
import { Leg } from './../../models/leg';
import { PncHomePage } from './../pnc-home/pnc-home';
import { LegProvider } from './../../providers/leg/leg';
import { GenderProvider } from './../../providers/gender/gender';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity.service';
import { TranslateService } from '@ngx-translate/core';
import { CrewMember } from '../../models/crewMember';


@IonicPage({
  name: 'FlightCrewListPage',
  segment: 'flightCrewList/:leg',
  defaultHistory: ['UpcomingFlightListPage']
})
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
    private translate: TranslateService,
    private sessionService: SessionService,
    private authGuard: AuthGuard) {
  }

  ionViewCanEnter() {
    return this.authGuard.guard().then(guardReturn => {
      if (guardReturn){
        let legId = this.navParams.get('leg');
        this.legProvider.getFlightCrewFromLeg(legId).then(flightCrew => {
          this.flightCrewList = flightCrew;
          flightCrew.forEach(crew => {
            if (crew.pnc.matricule === this.sessionService.authenticatedUser.matricule) {
              this.sessionService.appContext.onBoardRedactorFonction = crew.onBoardFonction;
            }
          });
        }, error => {
        });
      }else{
        return false;
      }
    });
  }

  openPncHomePage(matricule, onBoardFonction) {
    this.sessionService.appContext.observedPncMatricule = matricule;
    this.sessionService.appContext.onBoardObservedPncFonction = onBoardFonction;
    this.navCtrl.push(PncHomePage);
  }

}
