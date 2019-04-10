import { PncService } from '../../../../core/services/pnc/pnc.service';
import { RotationModel } from '../../../../core/models/rotation.model';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { SessionService } from '../../../../core/services/session/session.service';
import { AppConstant } from '../../../../app.constant';
import * as moment from 'moment';

@Component({
    selector: 'page-upcoming-flight-list',
    templateUrl: 'upcoming-flight-list.page.html',
})
export class UpcomingFlightListPage {
    matricule: string;

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
        if (this.navParams.get('matricule')) {
            this.matricule = this.navParams.get('matricule');
        } else if (this.sessionService.getActiveUser()) {
            this.matricule = this.sessionService.getActiveUser().matricule;
        }

        this.pncProvider.getAllRotations(this.matricule).then(allRotations => {
            if (allRotations != null) {
                this.lastPerformedRotations = allRotations.filter(rotation => {
                    const departureDate = new Date(rotation.departureDate);
                    const nowDate = new Date();
                    return departureDate < nowDate;
                });
                // On tri par date de départ croissante
                this.lastPerformedRotations = this.lastPerformedRotations.sort((rotation1, rotation2) => {
                    return moment(rotation1.departureDate, AppConstant.isoDateFormat).isBefore(moment(rotation2.departureDate, AppConstant.isoDateFormat)) ? -1 : 1;
                });
                this.upcomingRotations = allRotations.filter(rotation => {
                    const departureDate = new Date(rotation.departureDate);
                    const nowDate = new Date();
                    return departureDate > nowDate;
                });
            }
            this.lastPerformedRotations = (this.lastPerformedRotations != null && this.lastPerformedRotations.length > 0 ? this.lastPerformedRotations.slice(-2) : []);
            this.upcomingRotations = (this.upcomingRotations != null && this.upcomingRotations.length > 0 ? this.upcomingRotations : []);
        });
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
