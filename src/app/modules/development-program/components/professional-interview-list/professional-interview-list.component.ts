import { NavController, NavParams } from 'ionic-angular';

import { Component, Input } from '@angular/core';

import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import {
    ProfessionalInterviewService
} from '../../../../core/services/professional-interview/professional-interview.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import {
    ProfessionalInterviewDetailsPage
} from '../../../professional-interview/pages/professional-interview-details/professional-interview-details.page';
import {
    ProfessionalInterviewsArchivesPage
} from '../../../professional-interview/pages/professional-interviews-archives/professional-interviews-archives.page';

@Component({
    selector: 'professional-interview-list',
    templateUrl: 'professional-interview-list.component.html'
})

export class ProfessionalInterviewListComponent {

    @Input() professionalInterviews: ProfessionalInterviewModel[];
    matricule: string;

    // Nombre max de non draft à afficher
    maxNoDraftToDisplay = 3;

    constructor(
        private navParams: NavParams,
        private navCtrl: NavController,
        private securityService: SecurityService,
        private professionalInterviewService: ProfessionalInterviewService) {
        this.matricule = this.navParams.get('matricule');
    }

    /**
 * Dirige vers la page de création d'un nouveau bilan professionnel
 */
    goToProfessionalInterviewCreation() {
        this.navCtrl.push(ProfessionalInterviewDetailsPage, { matricule: this.matricule });
    }

    /**
     * Redirige vers la page des archives des bilans professionnels
     */
    goToProfessionalInterviewsArchives() {
        this.navCtrl.push(ProfessionalInterviewsArchivesPage, { matricule: this.matricule });
    }

    /**
     * Vérifie si le mode admin est disponible
     * @return vrai si le mode admin est disponible, faux sinon
     */
    isAdminModeAvailable(): boolean {
        return this.securityService.isProfessionalInterviewAdmin();
    }

}
