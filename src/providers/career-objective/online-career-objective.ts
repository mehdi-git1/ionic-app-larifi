import { StorageService } from './../../services/storage.service';
import { Entity } from './../../models/entity';
import { CareerObjective } from './../../models/careerObjective';
import { OfflineCareerObjectiveProvider } from './offline-career-objective';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class OnlineCareerObjectiveProvider {
  private careerObjectiveUrl: string;


  constructor(public restService: RestService,
    private config: Config,
    private offlineCareerObjectiveProvider: OfflineCareerObjectiveProvider,
    private storageService: StorageService) {
    this.careerObjectiveUrl = `${config.backEndUrl}/career_objectives`;
  }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @param storeOffline si on doit stocker le résultat en local
   * @return la liste des objectifs du pnc
   */
  getPncCareerObjectives(matricule: string, storeOffline: boolean = false): Promise<CareerObjective[]> {
    const promise: Promise<CareerObjective[]> = this.restService.get(`${this.careerObjectiveUrl}/pnc/${matricule}`);
    if (storeOffline) {
      promise.then(careerObjectiveList => {
        for (const careerObjective of careerObjectiveList) {
          this.offlineCareerObjectiveProvider.store(new CareerObjective().fromJSON(careerObjective));
        }
      });
    }
    return promise;
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
    const promise: Promise<CareerObjective> = this.restService.get(`${this.careerObjectiveUrl}/${id}`);
    if (storeOffline) {
      promise.then(careerObjective => {
        this.offlineCareerObjectiveProvider.store(new CareerObjective().fromJSON(careerObjective));
      });
    }
    return promise;
  }

  /**
  * Supprime un objectif
  * @param id l'id de l'objectif à supprimer
  * @return l'objectif supprimé
  */
  delete(id: number): Promise<CareerObjective> {
    this.storageService.deleteAsync(Entity.CAREER_OBJECTIVE, `${id}`);
    return this.restService.delete(`${this.careerObjectiveUrl}/${id}`);
  }
}
