import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from './../../services/connectivity.service';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

import { PncTransformerProvider } from './../../providers/pnc/pnc-transformer';
import { PncProvider } from './../../providers/pnc/pnc';
import { SessionService } from './../../services/session.service';
import { Leg } from './../../models/leg';
import { PncHomePage } from './../pnc-home/pnc-home';
import { LegProvider } from './../../providers/leg/leg';
import { GenderProvider } from './../../providers/gender/gender';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';

import { CrewMember } from '../../models/crewMember';

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
        public connectivityService: ConnectivityService,
        private toastProvider: ToastProvider,
        private translate: TranslateService,
        private pncProvider: PncProvider,
        private sessionService: SessionService,
        private pncTransformer: PncTransformerProvider) {
    }

    ionViewDidEnter() {
        const legId = this.navParams.get('legId');
        this.legProvider.getLeg(legId).then(legInfos => {
            this.leg = legInfos;
            this.legProvider.getFlightCrewFromLeg(legId).then(flightCrew => {
                this.flightCrewList = flightCrew;
                flightCrew.forEach(crew => {
                    if (crew.pnc.matricule !== undefined) {
                        if (crew.pnc.matricule === this.sessionService.authenticatedUser.matricule) {
                            this.sessionService.appContext.onBoardRedactorFonction = crew.onBoardFonction;
                        }
                        this.pncProvider.refreshOffLineDateOnPnc(this.pncTransformer.toPnc(crew.pnc)).then(foundPnc => {
                            crew.pnc = foundPnc;
                        }, error => {
                            this.toastProvider.info(this.translate.instant('FLIGHT_CREW_LIST.ERROR', { 'flightNumber': this.leg.number }));
                        });
                    }
                });
            }, error => { this.flightCrewList = []; });
        }, error => { });
    }

    /**
     * redirige vers la page d'accueil du pnc ou du cadre
     * @param matricule matricule du pnc concerné
     * @param onBoardFonction la fontion a bord du pnc concerné
     */
    openPncHomePage(matricule) {
        this.sessionService.appContext.observedPncMatricule = matricule;
        this.navCtrl.push(PncHomePage, { matricule: matricule });
    }

    /**
    * Vérifie que le chargement est terminé
    * @return true si c'est le cas, false sinon
    */
    loadingIsOver(): boolean {
        return this.leg !== undefined && this.flightCrewList !== undefined;
    }

}
