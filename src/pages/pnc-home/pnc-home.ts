import { Speciality } from './../../models/speciality';
import { CareerObjectiveListPage } from './../career-objective-list/career-objective-list';
import { PncProvider } from './../../providers/pnc/pnc';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Pnc } from '../../models/pnc';
import { Assignment } from '../../models/assignment';

@Component({
  selector: 'page-pnc-home',
  templateUrl: 'pnc-home.html',
})
export class PncHomePage {

  pnc: Pnc;
  matricule: String;
  // exporter la classe enum speciality dans la page html
  Speciality = Speciality;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private toastCtrl: ToastController,
    private pncProvider: PncProvider) {
    this.pnc = new Pnc();
    this.pnc.assignment = new Assignment();

  }

  /**
   * Charge les informations du pnc aprés le chargement de la page
   */
  ionViewDidLoad() {
    this.matricule = this.navParams.get("matricule");
    this.pncProvider.getPncInformations(this.matricule).then(result => {
      this.pnc = result;
    }, error => {
      this.toastCtrl.create({
        message: error.detailMessage,
        duration: 3000,
        position: 'bottom',
        cssClass: 'error',
      }).present();
    });
  }

  /**
   * Dirige vers la page de visualisation des objectifs
   */
  goToCareerObjectiveList() {
    this.navCtrl.push(CareerObjectiveListPage, {matricule:this.matricule});
  }
}
