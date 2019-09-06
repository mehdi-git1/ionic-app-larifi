import { NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { Component } from '@angular/core';

import { AppConstant } from '../../../../app.constant';
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

    constructor(private navParams: NavParams,
        private careerObjectiveService: CareerObjectiveService,
        private professionalInterviewService: ProfessionalInterviewService,
        private eObservationService: EObservationService,
        private sessionService: SessionService,
        private synchronizationProvider: SynchronizationService,
        private pncService: PncService) {
        this.lastConsultedRotation = this.sessionService.appContext.lastConsultedRotation;
        this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
            if (!synchroInProgress) {
                this.getEObservationsList();
                this.initCareerObjectivesList();
                this.getProfessionalInterviewList();
            }
        });
    }

    ionViewDidEnter() {
        this.matricule = this.navParams.get('matricule');
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => {
        });
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
    sortProfessionalInterviewsByAnnualProfessionalInterviewDate(professionalInterviews: ProfessionalInterviewModel[]): ProfessionalInterviewModel[] {
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
}
