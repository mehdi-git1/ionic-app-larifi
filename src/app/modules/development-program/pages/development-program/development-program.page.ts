import * as moment from 'moment';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppConstant } from '../../../../app.constant';
import { PermissionConstant } from '../../../../core/constants/permission.constant';
import {
    EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
import {
    ProfessionalInterviewStateEnum
} from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { FormsInputParamsModel } from '../../../../core/models/forms-input-params.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import { RotationModel } from '../../../../core/models/rotation.model';
import {
    AuthorizationService
} from '../../../../core/services/authorization/authorization.service';
import {
    CareerObjectiveService
} from '../../../../core/services/career-objective/career-objective.service';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import {
    ProfessionalInterviewService
} from '../../../../core/services/professional-interview/professional-interview.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../../core/services/synchronization/synchronization.service';

@Component({
    selector: 'page-development-program',
    templateUrl: 'development-program.page.html',
    styleUrls: ['./development-program.page.scss']
})
export class DevelopmentProgramPage {

    careerObjectives: CareerObjectiveModel[];
    eObservations: EObservationModel[];
    professionalInterviews: ProfessionalInterviewModel[];

    matricule: string;
    formsInputParam: FormsInputParamsModel;
    lastConsultedRotation: RotationModel;

    canDisplayMenu = false;

    // Expose l'enum au template
    EObservationDisplayModeEnum = EObservationDisplayModeEnum;
    TabHeaderEnum = TabHeaderEnum;

    // Liste des eForms possible
    eFormsList = [];

    // Nombre max de non draft à afficher
    maxNoDraftToDisplay = 3;

    chosenEFormsType = null;

    pnc: PncModel;

    constructor(
        private activatedRoute: ActivatedRoute,
        private careerObjectiveService: CareerObjectiveService,
        private professionalInterviewService: ProfessionalInterviewService,
        private eObservationService: EObservationService,
        private sessionService: SessionService,
        private synchronizationService: SynchronizationService,
        private authorizationService: AuthorizationService,
        private pncService: PncService) {
        this.lastConsultedRotation = this.sessionService.appContext.lastConsultedRotation;
        this.synchronizationService.synchroStatusChange.subscribe(synchroInProgress => {
            if (!synchroInProgress) {
                this.getEObservationsList();
                this.initCareerObjectivesList();
                this.getProfessionalInterviewList();
            }
        });
    }

    ionViewDidEnter() {
        if (this.activatedRoute.snapshot.paramMap.get('visitedPncMatricule')) {
            // Pour le parcours de dev
            this.matricule = this.activatedRoute.snapshot.paramMap.get('visitedPncMatricule');
        } else {
            this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        }
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
        this.getEObservationsList();
        this.initCareerObjectivesList();
        this.getProfessionalInterviewList();
    }

    /**
     * Récupére la liste des eObservations
     */
    getEObservationsList() {
        this.eObservationService.getEObservations(this.matricule).then(
            eobs => {
                this.eObservations = this.sortEObsByRotationDate(eobs);
            }, error => {
            });
    }

    /**
     * Trie la liste des eObservations par date de rotation
     * @param eObservations liste de eObservations
     * @return liste de eObservations triées
     */
    sortEObsByRotationDate(eObservations: EObservationModel[]): EObservationModel[] {
        return eObservations.sort((eObs1, eObs2) =>
            moment(eObs1.rotationDate, AppConstant.isoDateFormat).isAfter(moment(eObs2.rotationDate, AppConstant.isoDateFormat)) ? -1 : 1);
    }

    /**
     * Récupére la liste des bilans professionnels
     */
    getProfessionalInterviewList() {
        this.professionalInterviewService.getProfessionalInterviews(this.matricule).then(
            professionalInterviews => {
                this.professionalInterviews = this.sortProfessionalInterviewsByAnnualProfessionalInterviewDate(professionalInterviews);

                // On ne récupére que les Draft et les 3 derniers autres bilan
                let nbOfNoDraft = 0;
                const tmpProfessionalInterviewsTab = [];
                this.professionalInterviews.forEach((professionalInterview: ProfessionalInterviewModel) => {
                    if (professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT || nbOfNoDraft < this.maxNoDraftToDisplay) {
                        tmpProfessionalInterviewsTab.push(professionalInterview);
                        if (professionalInterview.state !== ProfessionalInterviewStateEnum.DRAFT) {
                            nbOfNoDraft++;
                        }
                    }
                });
                this.professionalInterviews = tmpProfessionalInterviewsTab;

            }, error => {
                this.professionalInterviews = [];
            });
    }

    /**
     * Trie la liste des bilans professionnels par date d'entretien
     * @param professionalInterviews liste de bilans professionnels
     * @return liste des bilans professionnels triés
     */
    sortProfessionalInterviewsByAnnualProfessionalInterviewDate(
        professionalInterviews: ProfessionalInterviewModel[]): ProfessionalInterviewModel[] {
        return professionalInterviews.sort((professionalInterview1, professionalInterview2) =>
            professionalInterview1.annualProfessionalInterviewDate < professionalInterview2.annualProfessionalInterviewDate ? 1 : -1);
    }

    /**
     * Récupère la liste des objectifs
     */
    initCareerObjectivesList() {
        this.careerObjectiveService.getPncCareerObjectives(this.matricule).then(result => {
            result.sort((careerObjective: CareerObjectiveModel, otherCareerObjective: CareerObjectiveModel) => {
                return careerObjective.creationDate < otherCareerObjective.creationDate ? 1 : -1;
            });
            this.careerObjectives = result;
        }, error => { });
    }

    /**
     * Rafraichit les listes de la page
     */
    refreshPage() {
        this.initCareerObjectivesList();
        this.getEObservationsList();
        this.getProfessionalInterviewList();
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.careerObjectives !== undefined && this.pnc !== undefined && this.eObservations !== undefined;
    }

    /**
     * Détermine si le bloc des priorités doit être affiché.<br>
     * On masque les priorités pour les tuteurs accédant au parcours de dev d'un alternant
     * @return vrai si c'est le cas, faux sinon
     */
    canViewCareerObjectives() {
        return !(this.authorizationService.hasPermission(PermissionConstant.VIEW_ALTERNANT_SEARCH)
            && !this.sessionService.isActiveUser(this.pnc))
            || this.sessionService.getActiveUser().isManager;
    }

    /**
     * Détermine si le bloc des bilans pro doit être affiché.<br>
     * On masque les bilans pro pour les tuteurs accédant au parcours de dev d'un alternant
     * @return vrai si c'est le cas, faux sinon
     */
    canViewProfessionalInterviews() {
        return !(this.authorizationService.hasPermission(PermissionConstant.VIEW_ALTERNANT_SEARCH)
            && !this.sessionService.isActiveUser(this.pnc))
            || this.sessionService.getActiveUser().isManager;
    }
}
