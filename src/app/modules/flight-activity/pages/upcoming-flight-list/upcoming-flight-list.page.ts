import { PncService } from '../../../../core/services/pnc/pnc.service';
import { RotationModel } from '../../../../core/models/rotation.model';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'page-upcoming-flight-list',
    templateUrl: 'upcoming-flight-list.page.html',
})
export class UpcomingFlightListPage {

    upcomingRotations: RotationModel[];
    lastPerformedRotations: RotationModel[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private pncProvider: PncService,
        private sessionService: SessionService) {
    }
    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        let matricule = '';
        if (this.navParams.get('matricule')) {
            matricule = this.navParams.get('matricule');
        } else if (this.sessionService.getActiveUser()) {
            matricule = this.sessionService.getActiveUser().matricule;
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
        return this.lastPerformedRotations && this.lastPerformedRotations.length > 0;
    }
}
