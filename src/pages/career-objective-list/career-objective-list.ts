import { ToastProvider } from './../../providers/toast/toast';
import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CareerObjectiveProvider } from '../../providers/career-objective/career-objective'


@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.html',
})
export class CareerObjectiveListPage {

  careerObjectiveList: CareerObjective[];

  matricule: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private toastProvider: ToastProvider) {

  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: this.matricule });
  }

  /**
   * Charge la liste des objectifs aprés le chargement de la page
   */
  ionViewDidLoad() {
    this.matricule = this.navParams.get('matricule');
    this.careerObjectiveProvider.getCareerObjectiveList(this.matricule).then(result => {
      this.careerObjectiveList = result;
    }, error => {
      this.toastProvider.error(error.detailMessage);
    });

  }

  /**
   * Ouvre un objectif => redirige vers la page de création de l'objectif
   * @param careerObjectiveId l'id de l'objectif à ouvrir
   */
  openCareerObjective(careerObjectiveId: number) {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: this.matricule, careerObjectiveId: careerObjectiveId });
  }
}
