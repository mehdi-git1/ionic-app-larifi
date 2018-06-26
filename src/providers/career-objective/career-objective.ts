import { OnlineCareerObjectiveProvider } from './online-career-objective';
import { ConnectivityService } from './../../services/connectivity.service';
import { OfflineCareerObjectiveProvider } from './../career-objective/offline-career-objective';
import { Config } from './../../configuration/environment-variables/config';
import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class CareerObjectiveProvider {
  constructor(
    private onlineCareerObjectiveProvider: OnlineCareerObjectiveProvider,
    private offlineCareerObjectiveProvider: OfflineCareerObjectiveProvider,
    private connectivityService: ConnectivityService) {
  }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @param storeOffline si on doit stocker le résultat en local
   * @return la liste des objectifs du pnc
   */
  getPncCareerObjectives(matricule: string, storeOffline: boolean = false): Promise<CareerObjective[]> {
    return this.connectivityService.isConnected() ?
      this.onlineCareerObjectiveProvider.getPncCareerObjectives(matricule, storeOffline) :
      this.offlineCareerObjectiveProvider.getPncCareerObjectives(matricule);
  }

  /**
   * Créé ou met à jour un objectif
   * @param  careerObjective l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  createOrUpdate(careerObjective: CareerObjective): Promise<CareerObjective> {
    return this.connectivityService.isConnected() ?
      this.onlineCareerObjectiveProvider.createOrUpdate(careerObjective) :
      this.offlineCareerObjectiveProvider.createOrUpdate(careerObjective);
  }

  /**
  * Récupère un objectif
  * @param id l'id de l'objectif à récupérer
  * @param storeOffline si on doit stocker le résultat en local
  * @return l'objectif récupéré
  */
  getCareerObjective(id: number, storeOffline: boolean = false): Promise<CareerObjective> {
    return this.connectivityService.isConnected() ?
      this.onlineCareerObjectiveProvider.getCareerObjective(id, storeOffline) :
      this.offlineCareerObjectiveProvider.getCareerObjective(id);
  }

  /**
  * Supprime un objectif
  * @param id l'id de l'objectif à supprimer
  * @return l'objectif supprimé
  */
  delete(id: number): Promise<CareerObjective> {
    return this.connectivityService.isConnected() ?
      this.onlineCareerObjectiveProvider.delete(id) :
      this.offlineCareerObjectiveProvider.delete(id);
  }
}
