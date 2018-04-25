import { AppConfig } from './../../app/app.config';
import { RestRequest } from './../../services/rest.base.service';
import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class CareerObjectiveProvider {
  private careerObjectiveUrl: string;

  constructor(public restService: RestService) {
    this.careerObjectiveUrl = `${AppConfig.apiUrl}/career_objectives`;
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
