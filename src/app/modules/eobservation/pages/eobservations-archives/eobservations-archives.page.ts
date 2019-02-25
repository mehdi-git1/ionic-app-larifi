import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';


@Component({
    selector: 'e-observations-archives',
    templateUrl: 'eobservations-archives.page.html',
})
export class EObservationsArchivesPage {
    matricule: string;
    eObservations: EObservationModel[];
    pnc: PncModel;

    constructor(
        public navParams: NavParams,
        private eObservationService: EObservationService,
        private sessionService: SessionService,
        private pncService: PncService) {
    }

    ionViewDidEnter() {
        if (this.navParams.get('matricule')) {
            this.matricule = this.navParams.get('matricule');
        } else if (this.sessionService.getActiveUser()) {
            this.matricule = this.sessionService.getActiveUser().matricule;
        }
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
            this.getEObservationsList();
        }, error => {
        });
    }

    /**
     * Récupére la liste des eObservations
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
