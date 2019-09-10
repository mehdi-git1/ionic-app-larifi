import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { Component } from '@angular/core';

import { AppConstant } from '../../../../app.constant';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { RotationModel } from '../../../../core/models/rotation.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'page-upcoming-flight-list',
    templateUrl: 'upcoming-flight-list.page.html',
})
export class UpcomingFlightListPage {
    matricule: string;

    pnc: PncModel;

    upcomingRotations: RotationModel[];
    lastPerformedRotations: RotationModel[];

    TabHeaderEnum = TabHeaderEnum;

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private pncService: PncService,
        private sessionService: SessionService) {
    }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.matricule = this.navParams.get('matricule');
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });

        this.lastPerformedRotations = undefined;
        this.upcomingRotations = undefined;
        this.pncService.getAllRotations(this.matricule).then(allRotations => {
            // Tri des rotations par date ascendante
            allRotations = this.sortByAscendingDepartureDate(allRotations);

            this.lastPerformedRotations = this.getLastPerformedRotations(allRotations);
            this.upcomingRotations = this.getUpcomingRotations(allRotations);
        }, error => { });
    }

    /**
     * Retourne les deux dernières rotations passées
     * @param rotations une liste de rotations
     * @return les deux dernières rotations passées
     */
    private getLastPerformedRotations(rotations: Array<RotationModel>): Array<RotationModel> {
        return rotations.filter(rotation => {
            return moment(rotation.departureDate).isBefore(moment());
        }).slice(-2);
    }

    /**
    * Retourne les rotations à venir
    * @param rotations une liste de rotations
    * @return les rotations à venir
    */
    private getUpcomingRotations(rotations: Array<RotationModel>): Array<RotationModel> {
        return rotations.filter(rotation => {
            return moment(rotation.departureDate).isAfter(moment());
        });
    }

    /**
     * Tri les rotations et tronçons par date de départ ascendante
     * @param rotations une liste de rotations
     * @return la liste des rotations triée par date de rotation
     */
    private sortByAscendingDepartureDate(rotations: Array<RotationModel>) {
        rotations.forEach(rotation => {
            rotation.legs.sort((leg1, leg2) => {
                return moment(leg1.departureDate, AppConstant.isoDateFormat).isBefore(moment(leg2.departureDate, AppConstant.isoDateFormat)) ? -1 : 1;
            });
        });

        return rotations.sort((rotation1, rotation2) => {
            return moment(rotation1.departureDate, AppConstant.isoDateFormat).isBefore(moment(rotation2.departureDate, AppConstant.isoDateFormat)) ? -1 : 1;
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
