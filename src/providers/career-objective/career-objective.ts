import { OfflineService } from './../../services/rest.offline.service';
import { Config } from './../../configuration/environment-variables/config';
import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class CareerObjectiveProvider {
  private careerObjectiveUrl: string;


  constructor(public restService: RestService,
    private config: Config,
    private offlineService: OfflineService) {
    this.careerObjectiveUrl = `${config.backEndUrl}/career_objectives`;
  }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @param storeOffline si on doit stocker le résultat en local
   * @return la liste des objectifs du pnc
   */
  getCareerObjectiveList(matricule: String, storeOffline: boolean = false): Promise<CareerObjective[]> {
    return this.restService.get(`${this.careerObjectiveUrl}/pnc/${matricule}`, null, null, storeOffline);
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
  * @param storeOffline si on doit stocker le résultat en local
  * @return l'objectif récupéré
  */
  getCareerObjective(id: number, storeOffline: boolean = false): Promise<CareerObjective> {
    return this.restService.get(`${this.careerObjectiveUrl}/${id}`, null, null, storeOffline);
  }

  /**
  * Supprime un objectif
  * @param id l'id de l'objectif à supprimer
  * @return l'objectif supprimé
  */
  delete(id: number): Promise<CareerObjective> {
    return this.restService.delete(`${this.careerObjectiveUrl}/${id}`);
  }
}
