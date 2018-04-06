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

  getPncList() {
    let r = new RestRequest();
    r.method = "GET";
    r.url = "/api/rest/resources/pncs";

    this.restService.call(r).then(pncList => {
      this.pncList = pncList;

      for (let pnc of this.pncList) {
        let pncRequest = new RestRequest();
        pncRequest.method = "GET";
        pncRequest.url = `/api/rest/resources/pncs/${pnc.matricule}`;
        this.restService.call(pncRequest).then(result => {
          console.log(result);
          pnc.lastName = 'toto' + result.lastName;
          pnc.firstName = 'titi' + result.firstName;
        })
      }
    });


  }


}
