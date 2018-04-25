import { CareerObjective } from './../../models/careerObjective';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService, RestRequest } from '../../services/rest.base.service';

@Injectable()
export class CareerObjectiveProvider {

  constructor(public http: HttpClient, public restService: RestService) {
  }
  /**
   * Fait appel au service rest qui renvois la liste des objectifs du pnc connecté.
   */
  getCareerObjectiveList() {
    let careerObjectiveList: CareerObjective[] = new Array();
    let pncRequest = new RestRequest();
    pncRequest.method = "GET";
    pncRequest.url = `/api/rest/resources/career_objectives/all`;
    this.restService.call(pncRequest).then(result => {
      result.forEach(element => {
        careerObjectiveList.push(element);
      });
    });
    return careerObjectiveList;
  }

}
