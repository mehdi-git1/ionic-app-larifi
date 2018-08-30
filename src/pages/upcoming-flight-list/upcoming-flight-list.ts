import { PncProvider } from './../../providers/pnc/pnc';
import { Rotation } from './../../models/rotation';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'page-upcoming-flight-list',
    templateUrl: 'upcoming-flight-list.html',
})
export class UpcomingFlightListPage {

    upcomingRotations: Rotation[];
    lastPerformedRotations: Rotation[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private pncProvider: PncProvider,
        private sessionService: SessionService) {
    }

    ionViewDidLoad() {
        let matricule = '';
        if (this.navParams.get('matricule')) {
            matricule = this.navParams.get('matricule');
        } else if (this.sessionService.authenticatedUser) {
            matricule = this.sessionService.authenticatedUser.matricule;
        }

        this.pncProvider.getLastPerformedRotations(matricule).then(lastPerformedRotations => {
            this.lastPerformedRotations = lastPerformedRotations;
        }, error => { });

        this.pncProvider.getUpcomingRotations(matricule).then(upcomingRotations => {
            this.upcomingRotations = upcomingRotations;
        }, error => { });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.lastPerformedRotations !== undefined && this.upcomingRotations !== undefined;
    }

    /**
     * Vérifie s'il existe des rotations à venir
     * @return true si c'est le cas, false sinon
     */
    hasUpcomingRotations() {
        return this.upcomingRotations && this.upcomingRotations.length > 0;
    }

    /**
    * Vérifie s'il existe des rotations passées
    * @return true si c'est le cas, false sinon
    */
    hasLastPerformedRotations() {
        return !this.lastPerformedRotations && this.lastPerformedRotations.length > 0;
    }
}
