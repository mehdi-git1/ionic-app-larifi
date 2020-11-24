import * as moment from 'moment';
import { AppConstant } from 'src/app/app.constant';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { CareerObjectiveFilterModel } from 'src/app/core/models/career-objective-filter.model';
import { EObservationModel } from 'src/app/core/models/eobservation/eobservation.model';
import { PncModel } from 'src/app/core/models/pnc.model';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { SecurityService } from 'src/app/core/services/security/security.service';

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
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
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

    matricule: string;
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

    careerObjectiveFilter: CareerObjectiveFilterModel;

    constructor(
        private activatedRoute: ActivatedRoute,
        private connectivityService: ConnectivityService,
        private sessionService: SessionService,
        private deviceService: DeviceService,
        private translateService: TranslateService,
        private pncService: PncService,
        private eObservationService: EObservationService,
        private careerObjectiveService: CareerObjectiveService,
        private professionalInterviewService: ProfessionalInterviewService,
        private securityService: SecurityService
    ) {
        this.initFilter();
    }

    /**
     * Initialise les filtres utilisés pour la recherche
     */
    initFilter() {
        this.careerObjectiveFilter = new CareerObjectiveFilterModel();
        this.careerObjectiveFilter.categoryCode = AppConstant.ALL;
    }

    ionViewDidEnter() {
        this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        });

        const eObservationsPromise = this.eObservationService.findEObservationsByRedactor(this.matricule).then(eObservations => {
            this.eObservations = eObservations;
        });

        const careerObjectivesPromise = this.careerObjectiveService.findCareerObjectivesByRedactor(this.matricule).then(careerObjectives => {
            this.careerObjectives = careerObjectives;
            this.careerObjectives.sort((priority1, priority2) => moment(priority1.creationDate, AppConstant.isoDateFormat).isAfter(moment(priority2.creationDate, AppConstant.isoDateFormat)) ? -1 : 1);
        });

        const professionalInterviewsPromise = this.professionalInterviewService.findProfessionalInterviewsByRedactor(this.matricule)
            .then(professionalInterviews => {
                this.professionalInterviews = professionalInterviews;
            });

        Promise.all([eObservationsPromise, careerObjectivesPromise, professionalInterviewsPromise]).then(success => {
            this.initTabList();
            this.selectAvailableTab();
        });
    }

    initTabList() {
        this.tabList = [
            {
                id: RedactionDisplayModeEnum.EOBSERVATION,
                label: this.translateService.instant('CAREER_OBJECTIVE_LIST.EOBS_TITLE'),
                count: this.eObservations ? this.eObservations.length : 0,
                available: this.eObservations && this.eObservations.length > 0
            },
            {
                id: RedactionDisplayModeEnum.CAREER_OBJECTIVE,
                label: this.translateService.instant('CAREER_OBJECTIVE_LIST.CAREER_OBJECTIVE_TITLE'),
                count: this.careerObjectives ? this.careerObjectives.length : 0,
                available: this.careerObjectives && this.careerObjectives.length > 0
            },
            {
                id: RedactionDisplayModeEnum.PROFESSIONAL_INTERVIEW,
                label: this.translateService.instant('CAREER_OBJECTIVE_LIST.PROFESSIONAL_INTERVIEW_TITLE'),
                count: this.professionalInterviews ? this.professionalInterviews.length : 0,
                available: this.professionalInterviews && this.professionalInterviews.length > 0
            },
            {
                id: RedactionDisplayModeEnum.EXTRA_REDACTION,
                label: this.translateService.instant('REDACTIONS.EXTRA_REDACTION_TITLE'),
                available: this.deviceService.isBrowser() && this.sessionService.getActiveUser().isManager
            }
        ];
    }

    /**
     * Vérifie si le pnc connecté ou le pnc consulté a des rédactions
     * @return vrai si le pnc a des rédactions, faux sinon
     */
    hasRedactions() {
        return this.eObservations && this.eObservations.length > 0
            || this.careerObjectives && this.careerObjectives.length > 0
            || this.professionalInterviews && this.professionalInterviews.length > 0;
    }

    /**
     * Recherche le premier onglet disponible ou l'onglet déja sélectionné et le marque comme sélectionné afin qu'il s'affiche en premier
     */
    selectAvailableTab() {
        if (this.selectedTab === undefined) {
            this.selectedTab = this.tabList.find(tab => tab.available);
        } else {
            const selectedTab = this.tabList.find(tab => tab.id === this.selectedTab.id);
            if (!selectedTab.available) {
                this.selectedTab = this.tabList.find(tab => tab.available);
            }
        }
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

    /**
     * Vérifie si l'on est connecté
     * @return true si on est connecté, false sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Verifie si on est en mode Web
     */
    isBrowser() {
        return this.deviceService.isBrowser();
    }

    /**
     * Recherche toutes les priorités de la catégorie concernée
     * @param category la category concernée
     */
    filterCategory(category: string) {
        this.careerObjectiveFilter.categoryCode = category;
        this.searchCareerObjectives();
    }

    /**
     * Récupère la liste des priorités
     */
    searchCareerObjectives() {
        this.careerObjectiveFilter.redactorMatricule = this.matricule;

        this.careerObjectiveService.getCareerObjectivesByFilter(this.careerObjectiveFilter).then(result => {
            result.sort((careerObjective: CareerObjectiveModel, otherCareerObjective: CareerObjectiveModel) => {
                return careerObjective.creationDate < otherCareerObjective.creationDate ? 1 : -1;
            });
            this.careerObjectives = result;
        }, error => { });
    }
}
