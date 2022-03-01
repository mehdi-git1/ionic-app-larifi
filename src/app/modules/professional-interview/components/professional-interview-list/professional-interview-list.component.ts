import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
    ProfessionalInterviewDisplayModeEnum
} from '../../../../core/enums/professional-interview/professional-interview-display-mode.enum';
import {
    ProfessionalInterviewTypeEnum
} from '../../../../core/enums/professional-interview/professional-interview-type.enum';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import { SecurityService } from '../../../../core/services/security/security.service';

@Component({
    selector: 'professional-interview-list',
    templateUrl: 'professional-interview-list.component.html',
    styleUrls: ['professional-interview-list.component.scss']
})

export class ProfessionalInterviewListComponent {

    @Input() professionalInterviews: ProfessionalInterviewModel[];
    @Input() displayMode: ProfessionalInterviewDisplayModeEnum;
    ProfessionalInterviewDisplayModeEnum = ProfessionalInterviewDisplayModeEnum;

    canDisplayMenu = false;
    // Liste des type de EDP possible
    professionalInterviewTypeList = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private securityService: SecurityService) {
    }

    /**
     * Dirige vers la page de création d'un nouveau bilan professionnel
     */
    goToProfessionalInterviewCreation(type: ProfessionalInterviewTypeEnum) {
        this.canDisplayMenu = false;
        this.router.navigate(['../professional-interview', 'create', type], { relativeTo: this.activatedRoute });
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

    /**
 * Affichage du menu de la liste des eForms
 */
    displayEdpTypeSelection() {
        this.professionalInterviewTypeList = new Array();
        this.professionalInterviewTypeList.push(ProfessionalInterviewTypeEnum.EDP);
        this.professionalInterviewTypeList.push(ProfessionalInterviewTypeEnum.EDP_6_YEARS);
        this.canDisplayMenu = true;
    }

}
