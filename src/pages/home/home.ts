import { RestRequest } from './../../services/rest.base.service';
import { PncHomePage } from './../pnc-home/pnc-home';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestService } from '../../services/rest.base.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pncList: Pnc[];
  matricule: string;

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
   * Dirige vers la page d'accueil des pnc
   */
  goToPncHome() {
    this.navCtrl.push(PncHomePage, { matricule: this.matricule });
  }
}
