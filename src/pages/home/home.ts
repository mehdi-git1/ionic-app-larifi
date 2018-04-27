import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';
import { CareerObjectiveListPage } from './../career-objective-list/career-objective-list';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestService, RestRequest } from '../../services/rest.base.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pncList: Pnc[];
  matricule: String;

  constructor(public navCtrl: NavController, public restService: RestService) {
  }

  makeRestCall() {
    let r = new RestRequest();
    r.method = "GET";
    r.url = "https://api.github.com/users";
    r.withCredential = false;

    this.restService.call(r).then(d => {
      //Work on data
    });
  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.navCtrl.push(CareerObjectiveCreatePage);
  }

  /**
   * Dirige vers la page de visualisation des objectifs
   */
  goToCareerObjectiveList() {
    this.matricule ="12345677";
    this.navCtrl.push(CareerObjectiveListPage, {matricule:this.matricule});
  }
}
