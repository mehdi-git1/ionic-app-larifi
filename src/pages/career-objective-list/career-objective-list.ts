import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { CareerObjectiveProvider } from '../../providers/career-objective/career-objective'


@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.html',
})
export class CareerObjectiveListPage {

  careerObjectiveList: CareerObjective[];

  matricule: String;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private toastCtrl: ToastController) {

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
      this.toastCtrl.create({
        message: error.detailMessage,
        duration: 3000,
        position: 'bottom',
        cssClass: 'error',
      }).present();
    });

  }
}
