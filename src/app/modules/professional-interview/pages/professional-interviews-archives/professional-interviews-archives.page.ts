import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PncModel } from '../../../../core/models/pnc.model';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import {
    ProfessionalInterviewService
} from '../../../../core/services/professional-interview/professional-interview.service';

@Component({
    selector: 'professional-interviews-archives',
    templateUrl: 'professional-interviews-archives.page.html',
    styleUrls: ['./professional-interviews-archives.page.scss']
})
export class ProfessionalInterviewsArchivesPage {
    matricule: string;
    professionalInterviews: ProfessionalInterviewModel[];
    pnc: PncModel;
    constructor(
        private activatedRoute: ActivatedRoute,
        private professionalInterviewService: ProfessionalInterviewService,
        private pncService: PncService) {
    }

    ionViewDidEnter() {
        this.matricule = this.activatedRoute.snapshot.paramMap.get('matricule');
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
