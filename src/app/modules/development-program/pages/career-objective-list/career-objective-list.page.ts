import { AppConstant } from './../../../../app.constant';
import { EObservationsArchivesPage } from './../../../eobservation/pages/eobservations-archives/eobservations-archives.page';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { EObservationService } from './../../../../core/services/eobservation/eobservation.service';
import { FormsEObservationService } from './../../../../core/services/forms/forms-e-observation.service';
import { FormsInputParamsModel } from './../../../../core/models/forms-input-params.model';
import { EFormsTypeEnum } from '../../../../core/enums/e-forms/e-forms-type.enum';

import { SynchronizationService } from '../../../../core/services/synchronization/synchronization.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { CareerObjectiveCreatePage } from '../career-objective-create/career-objective-create.page';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CareerObjectiveService } from '../../../../core/services/career-objective/career-objective.service';
import { RotationModel } from '../../../../core/models/rotation.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { PncModel } from '../../../../core/models/pnc.model';
import * as moment from 'moment';

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

  // Expose l'enum au template
  PncRole = PncRoleEnum;

  // Liste des eForms possible
  eFormsList = [];

  chosenEFormsType = null;

  pnc: PncModel;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private careerObjectiveService: CareerObjectiveService,
    private formsEObservationService: FormsEObservationService,
    private deviceService: DeviceService,
    private eObservationService: EObservationService,
    private sessionService: SessionService,
    private synchronizationProvider: SynchronizationService,
    private pncService: PncService) {
    this.lastConsultedRotation = this.sessionService.appContext.lastConsultedRotation;
    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      if (!synchroInProgress) {
        this.getEObservationsList();
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
    this.getEObservationsList();
    this.initCareerObjectivesList();
  }

  /**
   * Retourne le texte du type de formulaire pour la création d'EObs
   * @return retourne la valeur du type de formulaire
   */
  getEObsTextTypeEForm(): string {
    return EFormsTypeEnum.getTextType(EFormsTypeEnum[this.pnc.currentSpeciality]);
  }

  /**
 * Retourne le type de formulaire pour la création d'EObs
 * @return boolean pour savoir si le type d'Eform est géré actuellement
 */
  hasEObsTypeForm(): boolean {
    return EFormsTypeEnum.getType(EFormsTypeEnum[this.pnc.currentSpeciality]) ? true : false;
  }

  /**
   * Récupére la liste des eObservations
   */
  getEObservationsList() {
    this.eObservations = undefined;
    this.eObservationService.getEObservations(this.matricule).then(
      eobs => {
        this.eObservations = eobs.sort((eObs1, eObs2) => {
          return moment(eObs1.rotationDate, AppConstant.isoDateFormat).isAfter(moment(eObs2.rotationDate, AppConstant.isoDateFormat)) ? -1 : 1;
        });;
      }, error => {
      });
  }

  /**
    * Récupère la liste des objectifs
    */
  initCareerObjectivesList() {
    this.careerObjectives = undefined;
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
   * Fait appel à formsLib avec les paramètres eObservation.
   */
  createEObservation() {
    this.formsEObservationService.getFormsInputParams(this.matricule, this.sessionService.appContext.lastConsultedRotation.techId).then(formsInputParam => {
      this.formsInputParam = formsInputParam;
      if (this.formsInputParam) {
        this.formsEObservationService.callForms(this.formsInputParam, this.chosenEFormsType);
      }
    }, error => {
    });
  }

  /**
     * Détermine si on peut créer une nouvelle eObservation
     * @return vrai si c'est le cas, faux sinon
     */
  canCreateEObservation(): boolean {
    if (this.sessionService.appContext.lastConsultedRotation && !this.deviceService.isBrowser()) {
      return true;
    } else {
      return false;
    }
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
    this.getEObservationsList();
  }

  /**
   * Redirige vers la page des archives des eObservations
   */
  goToEobservationsArchives() {
    this.navCtrl.push(EObservationsArchivesPage, { matricule: this.matricule });
  }

  /**
   * Affichage du menu de la liste des eForms
   */
  displayEObservationTypeSelection() {
    const typeOfEForms = this.getEObsTextTypeEForm();
    if (typeOfEForms.indexOf('/') == -1) {
      this.createEObservation();
    } else {
      this.eFormsList = typeOfEForms.split('/');
      this.canDisplayMenu = true;
    }
  }

  /**
   * Appelle le formulaire choisi
   * @param value Valeur du type de formulaire choisie
   */
  getEFormsTypeBeforeCreate(value) {
    this.chosenEFormsType = this.formsEObservationService.getReportTypeForEForms(value.trim());
    this.canDisplayMenu = false;
    this.createEObservation();
  }
}
