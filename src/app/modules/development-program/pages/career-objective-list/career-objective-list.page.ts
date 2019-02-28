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

@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.page.html',
})
export class CareerObjectiveListPage {

  careerObjectives: CareerObjectiveModel[];
  matricule: string;
  formsInputParam: FormsInputParamsModel;
  lastConsultedRotation: RotationModel;

  eObservations: EObservationModel[];

  // Expose l'enum au template
  PncRole = PncRoleEnum;

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
  getEObsTextTypeForm(): string {
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
    this.eObservationService.getEObservations(this.matricule).then(
      eobs => {
        this.eObservations = eobs;
      }, error => {
      });
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
   * Fait appel à formsLib avec les paramètres eObservation.
   */
  createEObservation() {
    this.formsEObservationService.getFormsInputParams(this.matricule, this.sessionService.appContext.lastConsultedRotation.techId).then(formsInputParam => {
      this.formsInputParam = formsInputParam;
      if (this.formsInputParam) {
        this.formsEObservationService.callForms(this.formsInputParam);
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
}
