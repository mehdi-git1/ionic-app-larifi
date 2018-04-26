import { CareerObjective } from './../../models/careerObjective';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { RestService, RestRequest } from '../../services/rest.base.service';

@Injectable()
export class CareerObjectiveProvider {
  private careerObjectiveUrl: string;


  constructor(public restService: RestService) {
    this.careerObjectiveUrl = `${AppConfig.apiUrl}/career_objectives`;
  }
  /**
   * Fait appel au service rest qui renvois la liste des objectifs du pnc connecté.
   * @return la liste des objectifs
   */
  getCareerObjectiveList(): Promise<CareerObjective[]> {
    let request = new RestRequest();
    request.method = "GET";
    request.url = this.careerObjectiveUrl + "/all";
    return this.restService.call(request);
  }

  /**
   * Créé un objectif
   * @param  careerObjective l'objectif à créer
   * @return une promesse contenant l'objectif créé
   */
  create(careerObjective: CareerObjective): Promise<CareerObjective> {
    let request = new RestRequest();
    request.method = "POST";
    request.url = this.careerObjectiveUrl;
    request.jsonData = careerObjective;

    return this.restService.call(request);
  }
}
