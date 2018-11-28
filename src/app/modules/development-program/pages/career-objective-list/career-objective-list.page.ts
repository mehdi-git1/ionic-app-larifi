import { SynchronizationService } from '../../../../core/services/synchronization/synchronization.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { EObservationModel } from '../../../../core/models/e-observation.model';
import { EFormsEObservationService } from '../../../../core/services/e-forms/e-forms-e-observation.service';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { CareerObjectiveCreatePage } from '../career-objective-create/career-objective-create.page';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CareerObjectiveProvider } from '../../../../core/services/career-objective/career-objective.service';
import { RotationModel } from '../../../../core/models/rotation.model';

@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.page.html',
})
export class CareerObjectiveListPage {

  careerObjectiveList: CareerObjectiveModel[];
  matricule: string;
  eObservation: EObservationModel;
  lastConsultedRotation: RotationModel;

  // Expose l'enum au template
  PncRole = PncRoleEnum;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private eObservationService: EFormsEObservationService,
    private deviceService: DeviceService,
    private sessionService: SessionService,
    private synchronizationProvider: SynchronizationService) {
    this.lastConsultedRotation = this.sessionService.appContext.lastConsultedRotation;
    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      if (!synchroInProgress) {
        this.initCareerObjectivesList();
      }
    });
  }
  ionViewDidEnter() {
    this.initPage();
  }

  /**
   * Initialisation du contenu de la page.
   */
  initPage() {
    this.matricule = this.navParams.get('matricule');
    this.initCareerObjectivesList();
  }

  initCareerObjectivesList() {
    this.careerObjectiveProvider.getPncCareerObjectives(this.matricule).then(result => {
      result.sort((careerObjective: CareerObjectiveModel, otherCareerObjective: CareerObjectiveModel) => {
        return careerObjective.creationDate < otherCareerObjective.creationDate ? 1 : -1;
      });
      this.careerObjectiveList = result;
    }, error => { });
  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: this.matricule, careerObjectiveId: 0 });
  }

  /**
   * Ouvre un objectif => redirige vers la page de création de l'objectif
   * @param careerObjectiveId l'id de l'objectif à ouvrir
   */
  openCareerObjective(careerObjectiveId: number) {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: this.matricule, careerObjectiveId: careerObjectiveId });
  }

  /**
   * Fait appel à formsLib avec les paramètres eObservation.
   */
  createEObservation() {
    this.eObservationService.getEObservation(this.matricule, this.sessionService.appContext.lastConsultedRotation.techId).then(eObservation => {
      this.eObservation = eObservation;
      if (this.eObservation) {
        this.eObservationService.callForms(this.eObservation);
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
    return this.careerObjectiveList !== undefined;
  }
}