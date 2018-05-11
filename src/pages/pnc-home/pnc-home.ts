import { ToastProvider } from './../../providers/toast/toast';
import { GenderProvider } from './../../providers/gender/gender';
import { Speciality } from './../../models/speciality';
import { CareerObjectiveListPage } from './../career-objective-list/career-objective-list';
import { PncProvider } from './../../providers/pnc/pnc';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    private pncProvider: PncProvider,
    public genderProvider: GenderProvider,
    private toastProvider: ToastProvider) {

    this.pnc = new Pnc();
    this.pnc.assignment = new Assignment();

    // TEMPORAIRE
    this.matricule = '07755754';
  }

  /**
   * Charge les informations du pnc aprés le chargement de la page
   */
  ionViewDidLoad() {
    if (this.navParams.get('matricule')) {
      console.log(this.navParams.get('matricule'));
      this.matricule = this.navParams.get('matricule');
    }

    this.pncProvider.getPnc(this.matricule).then(foundPnc => {
      this.pnc = foundPnc;
    }, error => {
      this.toastProvider.error(error.detailMessage);
    });
  }

  /**
   * Dirige vers la page de visualisation des objectifs
   */
  goToCareerObjectiveList() {
    this.navCtrl.push(CareerObjectiveListPage, { matricule: this.matricule });
  }

  /**
   * Redirige vers le EDossier du PNC saisi
   */
  goToEdossier() {
    this.navCtrl.push(PncHomePage, { matricule: this.matricule });
  }
}
