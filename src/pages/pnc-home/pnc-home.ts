import { PncProvider } from './../../providers/pnc/pnc';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Pnc } from '../../models/pnc';

@Component({
  selector: 'page-pnc-home',
  templateUrl: 'pnc-home.html',
})
export class PncHomePage {

  pnc: Pnc;
  matricule: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pncProvider: PncProvider) {

  }

  /**
   * Charge les informations du pnc aprés le chargement de la page
   */
  ionViewDidLoad() {
    this.matricule = this.navParams.get("matricule");
    this.pncProvider.getPncInformations(this.matricule).then(result =>{
        this.pnc = result;
      });
  }
}
