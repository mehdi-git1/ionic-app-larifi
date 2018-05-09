import { PncHomePage } from './../pnc-home/pnc-home';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  matricule: string;

  constructor(public navCtrl: NavController) {
    // TEMPORAIRE : pour préremplir le champs et éviter les crises de nerf
    this.matricule = '07339967';
  }

  /**
  * Dirige vers la page d'accueil des pnc
  */
  goToPncHome() {
    this.navCtrl.push(PncHomePage, { matricule: this.matricule });
  }
}
