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

@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.html',
})
export class CareerObjectiveListPage {

  careerObjectiveList: CareerObjective[];
  matricule: string;
  eObservation: EObservation;

  // Expose l'enum au template
  PncRole = PncRole;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private toastProvider: ToastProvider,
    private eObservationService: EObservationService,
    private sessionService: SessionService) {
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
   * Récupère les paramètres pour l'appel à formsLib
   */
  getEObservation() {
    return new Promise((resolve, reject) => {
      this.eObservationService.getEObservation(this.matricule, this.sessionService.appContext.rotationId).then(eObservation => {
        this.eObservation = eObservation;
        resolve();
      }, error => {
        reject();
      });
    });
  }

  /**
   * Fait appel a formsLib avec les paramètres déja reçu dans l'objet eObservation.
   */
  callForms() {
    this.getEObservation();
    if (this.eObservation) {
      this.eObservationService.callForms(this.eObservation);
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
