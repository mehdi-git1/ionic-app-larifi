import { OfflineAction } from './../../models/offlineAction';
import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Entity } from '../../models/entity';


@Injectable()
export class OfflineCareerObjectiveProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Stocke dans le cache un objectif
   * @param careerObjective l'objectif à stocker en cache
   * @return une promesse contenant l'objectif mis en cache
   */
  store(careerObjective: CareerObjective): Promise<CareerObjective> {
    return this.createOrUpdate(careerObjective);
  }

  /**
   * Créé ou met à jour un objectif dans le cache
   * @param careerObjective l'objectif à sauver en cache
   * @return une promesse contenant l'objectif sauvé en cache
   */
  createOrUpdate(careerObjective: CareerObjective): Promise<CareerObjective> {
    return this.storageService.saveAsync(Entity.CAREER_OBJECTIVE, careerObjective);
  }

  /**
   * Récupère la liste des objectifs d'un PNC à partir du cache
   * @param pncMatricule le matricule du PNC dont on souhaite récupérer les objectifs
   * @return une promesse contenant les objectifs du PNC
   */
  getPncCareerObjectives(pncMatricule: string): Promise<CareerObjective[]> {
    return new Promise((resolve, reject) => {
      const careerObjectiveList = this.storageService.findAll(Entity.CAREER_OBJECTIVE);
      const pncCareerObjectives = careerObjectiveList.filter(careerObjective => {
        return careerObjective.pnc.matricule === pncMatricule && careerObjective.offlineAction !== OfflineAction.DELETE;
      });
      resolve(pncCareerObjectives);
    });
  }

  /**
   * Récupère un objectif du cache à partir de son id
   * @param id l'id de l'objectif qu'on souhaite récupérer
   * @return une promesse contenant l'objectif récupéré
   */
  getCareerObjective(id: number): Promise<CareerObjective> {
    return this.storageService.findOneAsync(Entity.CAREER_OBJECTIVE, `${id}`);
  }

  /**
   * Supprime du cache un objectif à partir de son id
   * @param id l'id de l'objectif à supprimer
   * @return une promesse contenant l'objectif supprimé
   */
  delete(id: number): Promise<CareerObjective> {
    return this.storageService.deleteAsync(Entity.CAREER_OBJECTIVE, `${id}`);
  }

  /**
   * Met à jour la date de mise en cache dans l'objet online
   * @param careerObjective objet online
   */
  refreshOfflineStorageDate(careerObjective: CareerObjective) {
    // cette méthode n'est pas utile en mode offline
  }
}
