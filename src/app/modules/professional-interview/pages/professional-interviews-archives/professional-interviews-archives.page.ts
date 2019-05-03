import { ProfessionalInterviewService } from './../../../../core/services/professional-interview/professional-interview.service';
import { ProfessionalInterviewModel } from './../../../../core/models/professional-interview/professional-interview.model';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { SessionService } from '../../../../core/services/session/session.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
    selector: 'professional-interviews-archives',
    templateUrl: 'professional-interviews-archives.page.html',
})
export class ProfessionalInterviewsArchivesPage {
    matricule: string;
    professionalInterviews: ProfessionalInterviewModel[];
    pnc: PncModel;
    constructor(
        public navParams: NavParams,
        private professionalInterviewService: ProfessionalInterviewService,
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
        }, error => {
        });
        this.getProfessionalInterviewsList();
    }

    /**
     * Récupére la liste de toutes les bilans professionnels d'un PNC
     */
    getProfessionalInterviewsList() {
        this.professionalInterviewService.getProfessionalInterviews(this.matricule).then(
            professionalInterviews => {
                this.professionalInterviews = professionalInterviews;
            }, error => {
            });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.professionalInterviews !== undefined;
    }

}
