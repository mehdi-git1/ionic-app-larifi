import { AppConfig } from './../../app/app.config';
import { CareerObjective } from './../../models/careerObjective';
import { HttpClient } from '@angular/common/http';
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
   * Créé ou met à jour un objectif
   * @param  careerObjective l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  createOrUpdate(careerObjective: CareerObjective): Promise<CareerObjective> {
    return this.restService.post(this.careerObjectiveUrl, careerObjective);
  }
}
