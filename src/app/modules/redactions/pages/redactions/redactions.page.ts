import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { EObservationModel } from 'src/app/core/models/eobservation/eobservation.model';
import { PncModel } from 'src/app/core/models/pnc.model';
import { DeviceService } from 'src/app/core/services/device/device.service';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
    CareerObjectiveDisplayModeEnum
} from '../../../../core/enums/career-objective/career-objective-display-mode.enum';
import {
    EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
import {
    ProfessionalInterviewDisplayModeEnum
} from '../../../../core/enums/professional-interview/professional-interview-display-mode.enum';
import { RedactionDisplayModeEnum } from '../../../../core/enums/redaction-display-mode.enum';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import {
    CareerObjectiveService
} from '../../../../core/services/career-objective/career-objective.service';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import {
    ProfessionalInterviewService
} from '../../../../core/services/professional-interview/professional-interview.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'page-redactions',
    templateUrl: 'redactions.page.html',
    styleUrls: ['./redactions.page.scss']
})
export class RedactionsPage {

    tabList: Array<any>;
    pnc: PncModel;
    selectedTab: any;

    TabHeaderEnum = TabHeaderEnum;
    RedactionDisplayModeEnum = RedactionDisplayModeEnum;
    EObservationDisplayModeEnum = EObservationDisplayModeEnum;
    CareerObjectiveDisplayModeEnum = CareerObjectiveDisplayModeEnum;
    ProfessionalInterviewDisplayModeEnum = ProfessionalInterviewDisplayModeEnum;

    eObservations: Array<EObservationModel>;
    careerObjectives: Array<CareerObjectiveModel>;
    professionalInterviews: Array<ProfessionalInterviewModel>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private deviceService: DeviceService,
        private translateService: TranslateService,
        private pncService: PncService,
        private eObservationService: EObservationService,
        private careerObjectiveService: CareerObjectiveService,
        private professionalInterviewService: ProfessionalInterviewService
    ) {

    }

    ionViewDidEnter() {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        });

        const eObservationsPromise = this.eObservationService.findEObservationsByRedactor(matricule).then(eObservations => {
            this.eObservations = eObservations;
        });

        const careerObjectivesPromise = this.careerObjectiveService.findCareerObjectivesByRedactor(matricule).then(careerObjectives => {
            this.careerObjectives = careerObjectives;
        });

        const professionalInterviewsPromise = this.professionalInterviewService.findProfessionalInterviewsByRedactor(matricule)
            .then(professionalInterviews => {
                this.professionalInterviews = professionalInterviews;
            });

        Promise.all([eObservationsPromise, careerObjectivesPromise, professionalInterviewsPromise]).then(success => {
            this.initTabList();
            if (this.selectedTab === undefined) {
                // A faire qu'une fois pour conserver l'onglet sélectionné quand on revient sur la page
                this.selectFirstAvailableTab();
            }
        });
    }

    initTabList() {
        this.tabList = [
            {
                id: RedactionDisplayModeEnum.EOBSERVATION,
                label: this.translateService.instant('CAREER_OBJECTIVE_LIST.EOBS_TITLE'),
                count: this.eObservations.length,
                available: this.eObservations.length > 0
            },
            {
                id: RedactionDisplayModeEnum.CAREER_OBJECTIVE,
                label: this.translateService.instant('CAREER_OBJECTIVE_LIST.CAREER_OBJECTIVE_TITLE'),
                count: this.careerObjectives.length,
                available: this.careerObjectives.length > 0
            },
            {
                id: RedactionDisplayModeEnum.PROFESSIONAL_INTERVIEW,
                label: this.translateService.instant('CAREER_OBJECTIVE_LIST.PROFESSIONAL_INTERVIEW_TITLE'),
                count: this.professionalInterviews.length,
                available: this.professionalInterviews.length > 0
            },
            {
                id: RedactionDisplayModeEnum.EXTRA_REDACTION,
                label: this.translateService.instant('REDACTIONS.EXTRA_REDACTION_TITLE'),
                available: this.deviceService.isBrowser() && this.sessionService.getActiveUser().isManager
            }
        ];
    }

    /**
     * Recherche le premier onglet disponible et le marque comme sélectionné afin qu'il s'affiche en premier
     */
    selectFirstAvailableTab() {
        this.selectedTab = this.tabList.find(tab => tab.available);
    }

    /**
     * Vérifie si un onglet est actif
     * @param tabId l'onglet à tester
     * @return vrai si l'onglet est actif, faux sinon
     */
    isTabActive(tabId: RedactionDisplayModeEnum): boolean {
        return tabId === this.selectedTab.id;
    }

    /**
     * Affiche l'onglet donné en paramètre
     * @param tab l'onglet à afficher
     */
    goToTab(tab: any) {
        this.selectedTab = tab;
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.eObservations !== undefined
            && this.professionalInterviews !== undefined
            && this.careerObjectives !== undefined;
    }
}
