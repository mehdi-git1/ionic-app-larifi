import { DeviceService } from './../../services/device.service';
import { SecMobilService } from './../../services/secMobil.service';
import { SessionService } from './../../services/session.service';
import { EObservation } from './../../models/eObservation';
import { EObservationService } from './../../services/eObservation.service';
import { PncRole } from './../../models/pncRole';
import { ToastProvider } from './../../providers/toast/toast';
import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { CareerObjectiveProvider } from '../../providers/career-objective/career-objective';
import { Rotation } from '../../models/rotation';

@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.html',
})
export class CareerObjectiveListPage {

  careerObjectiveList: CareerObjective[];
  matricule: string;
  eObservation: EObservation;
  lastConsultedRotation: Rotation;

  // Expose l'enum au template
  PncRole = PncRole;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private eObservationService: EObservationService,
    private deviceService: DeviceService,
    private sessionService: SessionService) {
    this.lastConsultedRotation = this.sessionService.appContext.lastConsultedRotation;
  }

  ionViewDidEnter() {
    this.matricule = this.navParams.get('matricule');
    this.careerObjectiveProvider.getPncCareerObjectives(this.matricule).then(result => {
      result.sort((careerObjective: CareerObjective, otherCareerObjective: CareerObjective) => {
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
    this.eObservationService.getEObservation(this.matricule, this.sessionService.appContext.lastConsultedRotation).then(eObservation => {
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
