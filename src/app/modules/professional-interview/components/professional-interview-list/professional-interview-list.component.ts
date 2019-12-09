
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import { SecurityService } from '../../../../core/services/security/security.service';
import { ProfessionalInterviewDisplayModeEnum } from '../../../../core/enums/professional-interview/professional-interview-display-mode.enum';


@Component({
    selector: 'professional-interview-list',
    templateUrl: 'professional-interview-list.component.html',
    styleUrls: ['professional-interview-list.component.scss']
})

export class ProfessionalInterviewListComponent {

    @Input() professionalInterviews: ProfessionalInterviewModel[];
    @Input() displayMode: ProfessionalInterviewDisplayModeEnum;
    ProfessionalInterviewDisplayModeEnum = ProfessionalInterviewDisplayModeEnum;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private securityService: SecurityService) {
    }

    /**
     * Dirige vers la page de création d'un nouveau bilan professionnel
     */
    goToProfessionalInterviewCreation() {
        this.router.navigate(['../professional-interview', 'create'], { relativeTo: this.activatedRoute });
    }

    /**
     * Redirige vers la page des archives des bilans professionnels
     */
    goToProfessionalInterviewsArchives() {
        this.router.navigate(['../professional-interview', 'archive'], { relativeTo: this.activatedRoute });
    }

    /**
     * Redirige vers le détail d'un bilan pro
     * @param professionalInterviewId l'id du bilan pro sélectionné
     */
    goToProfessionalInterviewDetail(professionalInterviewId) {
        this.router.navigate(['../professional-interview', 'detail', professionalInterviewId], { relativeTo: this.activatedRoute });
    }

    /**
     * Vérifie si le mode admin est disponible
     * @return vrai si le mode admin est disponible, faux sinon
     */
    isAdminModeAvailable(): boolean {
        return this.securityService.isProfessionalInterviewAdmin();
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

}
