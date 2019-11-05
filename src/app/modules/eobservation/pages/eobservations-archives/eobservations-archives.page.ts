import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
    selector: 'e-observations-archives',
    templateUrl: 'eobservations-archives.page.html',
    styleUrls: ['./eobservations-archives.page.scss']
})
export class EObservationsArchivesPage {
    matricule: string;
    eObservations: EObservationModel[];
    pnc: PncModel;

    EObservationDisplayModeEnum = EObservationDisplayModeEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private eObservationService: EObservationService,
        private pncService: PncService
    ) {
    }

    ionViewDidEnter() {
        this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
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
