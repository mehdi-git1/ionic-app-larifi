
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import { SecurityService } from '../../../../core/services/security/security.service';

@Component({
    selector: 'professional-interview-list',
    templateUrl: 'professional-interview-list.component.html'
})

export class ProfessionalInterviewListComponent {

    @Input() professionalInterviews: ProfessionalInterviewModel[];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private securityService: SecurityService) {
    }

    /**
     * Dirige vers la page de création d'un nouveau bilan professionnel
     */
    goToProfessionalInterviewCreation() {
        this.router.navigate(['professional-interview', 'create'], { relativeTo: this.activatedRoute });
    }

    /**
     * Redirige vers la page des archives des bilans professionnels
     */
    goToProfessionalInterviewsArchives() {
        this.router.navigate(['professional-interview', 'archive'], { relativeTo: this.activatedRoute });
    }

    /**
     * Vérifie si le mode admin est disponible
     * @return vrai si le mode admin est disponible, faux sinon
     */
    isAdminModeAvailable(): boolean {
        return this.securityService.isProfessionalInterviewAdmin();
    }

}
