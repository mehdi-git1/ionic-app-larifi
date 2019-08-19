import { NavController, NavParams } from 'ionic-angular';

import { Component } from '@angular/core';

import {
    EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
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
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../../core/services/synchronization/synchronization.service';
import { CareerObjectiveCreatePage } from '../career-objective-create/career-objective-create.page';

@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.page.html',
})
export class CareerObjectiveListPage {

  careerObjectives: CareerObjectiveModel[];
  matricule: string;
  formsInputParam: FormsInputParamsModel;
  lastConsultedRotation: RotationModel;

  canDisplayMenu = false;

  eObservations: EObservationModel[];

  professionalInterviews: ProfessionalInterviewModel[];

  // Expose l'enum au template
  EObservationDisplayModeEnum = EObservationDisplayModeEnum;
  TabHeaderEnum = TabHeaderEnum;

  // Liste des eForms possible
  eFormsList = [];

  // Nombre max de non draft à afficher
  maxNoDraftToDisplay = 3;

  chosenEFormsType = null;

  pnc: PncModel;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private securityService: SecurityService,
    private careerObjectiveService: CareerObjectiveService,
    private sessionService: SessionService,
    private synchronizationProvider: SynchronizationService,
    private pncService: PncService) {
    this.lastConsultedRotation = this.sessionService.appContext.lastConsultedRotation;
    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      if (!synchroInProgress) {
        this.initCareerObjectivesList();
      }
    });
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
    this.initCareerObjectivesList();
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
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: this.matricule, careerObjectiveId: 0 });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.careerObjectives !== undefined && this.pnc !== undefined && this.eObservations !== undefined;
  }

  /**
   * Rafraichit les listes de la page
   */
  refreshPage() {
    this.initCareerObjectivesList();
  }

  /**
   * Vérifie si le mode admin est disponible
   * @return vrai si le mode admin est disponible, faux sinon
   */
  isAdminModeAvailable(): boolean {
    return this.securityService.isProfessionalInterviewAdmin();
  }

  /**
   * Renvoie la spécialité du pnc à afficher
   * @param pnc le pnc concerné
   * @return la fonction du pnc à afficher
   */
  getFormatedSpeciality(pnc: PncModel): string {
    return this.pncService.getFormatedSpeciality(pnc);
  }
}
