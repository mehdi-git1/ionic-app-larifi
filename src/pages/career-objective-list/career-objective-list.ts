import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';
import { CareerObjective } from './../../models/careerObjective';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestService, RestRequest } from '../../services/rest.base.service';
import { CareerObjectiveProvider } from '../../providers/career-objective/career-objective'

/**
 * Generated class for the CareerObjectiveListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.html',
})
export class CareerObjectiveListPage {

  careerObjectiveList: CareerObjective[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private careerObjectiveProvider: CareerObjectiveProvider) {

  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.navCtrl.push(CareerObjectiveCreatePage);
  }

  /**
   * Charge la liste des objectifs aprés le chargement de la page
   */
  ionViewDidLoad() {
    this.careerObjectiveProvider.getCareerObjectiveList().then(result => {
      this.careerObjectiveList = result;
    });
  }
}
