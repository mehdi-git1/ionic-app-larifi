import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService, RestRequest } from '../../services/rest.base.service';
import { Pnc } from '../../models/pnc';

/**
 * Generated class for the PncHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pnc-home',
  templateUrl: 'pnc-home.html',
})
export class PncHomePage {

  pnc: Pnc;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restService: RestService) {
    this.getPncInformations();
  }

  /**
   * récupération des informations du pnc en appelant le service rest pncs avec le matricule.
   */
  getPncInformations(){
      this.pnc = new Pnc();
      // récupèration du matricule du pnc envoyé en paramètre.
      let matricule='12345679';
      let pncRequest = new RestRequest();
      pncRequest.method = "GET";
      pncRequest.url = `/api/rest/resources/pncs/${matricule}`;
      this.restService.call(pncRequest).then(result => {
        this.pnc = result;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PncHomePage');
  }

}
