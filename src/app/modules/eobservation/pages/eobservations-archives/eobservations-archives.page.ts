import { NavParams } from 'ionic-angular';

import { Component } from '@angular/core';

import {
    EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'e-observations-archives',
    templateUrl: 'eobservations-archives.page.html',
})
export class EObservationsArchivesPage {
    matricule: string;
    eObservations: EObservationModel[];
    pnc: PncModel;

    EObservationDisplayModeEnum = EObservationDisplayModeEnum;

    constructor(
        public navParams: NavParams,
        private eObservationService: EObservationService,
        private pncService: PncService,
        private sessionService: SessionService) {
    }

    ionViewDidEnter() {
        this.matricule = this.sessionService.getActiveUser().matricule;
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
        this.getEObservationsList();
    }

    /**
     * Récupére la liste de toutes les eObservations d'un PNC
     */
    getEObservationsList() {
        this.eObservationService.getAllEObservations(this.matricule).then(
            eobs => {
                this.eObservations = eobs;
            }, error => {
            });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.eObservations !== undefined;
    }

}
