import { AppConfig } from './../../app/app.config';
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
   * Fait appel au service rest qui renvois la liste des objectifs du pnc connecté.
   * @return la liste des objectifs
   */
  getCareerObjectiveList(matricule: String): Promise<CareerObjective[]> {
    return this.restService.get(`${this.careerObjectiveUrl}/${matricule}`);
  }

  /**
   * Créé ou met à jour un objectif
   * @param  careerObjective l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  createOrUpdate(careerObjective: CareerObjective): Promise<CareerObjective> {
    return this.restService.post(this.careerObjectiveUrl, careerObjective);
  }

  /**
  * Récupère un objectif
  * @param id l'id de l'objectif à récupérer
  * @return l'objectif récupéré
  */
  getCareerObjective(id: number): Promise<CareerObjective> {
    return this.restService.get(`${this.careerObjectiveUrl}/${id}`);
  }
}
