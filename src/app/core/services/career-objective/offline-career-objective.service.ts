import { AppConstant } from 'src/app/app.constant';

import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { OfflineActionEnum } from '../../enums/offline-action.enum';
import { CareerObjectiveFilterModel } from '../../models/career-objective-filter.model';
import { CareerObjectiveModel } from '../../models/career-objective.model';
import { StorageService } from '../../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class OfflineCareerObjectiveService {

  constructor(private storageService: StorageService) {
  }

  /**
   * Créé ou met à jour un objectif dans le cache
   * @param careerObjective l'objectif à sauver en cache
   * @param online si on est connecté ou non
   * @return une promesse contenant l'objectif sauvé en cache
   */
  createOrUpdate(careerObjective: CareerObjectiveModel, online: boolean = false): Promise<CareerObjectiveModel> {
    return this.storageService.saveAsync(EntityEnum.CAREER_OBJECTIVE, careerObjective, online);
  }

  /**
   * Récupère la liste des objectifs d'un PNC à partir du cache
   * @param pncMatricule le matricule du PNC dont on souhaite récupérer les objectifs
   * @return une promesse contenant les objectifs du PNC
   */
  getPncCareerObjectives(pncMatricule: string): Promise<CareerObjectiveModel[]> {
    return new Promise((resolve, reject) => {
      const careerObjectiveList = this.storageService.findAll(EntityEnum.CAREER_OBJECTIVE);
      const pncCareerObjectives = careerObjectiveList.filter(careerObjective => {
        return careerObjective.pnc.matricule === pncMatricule && careerObjective.offlineAction !== OfflineActionEnum.DELETE;
      });
      resolve(pncCareerObjectives);
    });
  }

  /**
   * Récupère les objectifs filtrées d'un pnc
   * @param matricule le matricule du PNC dont on souhaite récupérer les objectifs
   * @return la liste des objectifs filtrés
   */
  getCareerObjectivesByFilter(careerObjectiveSearch: CareerObjectiveFilterModel): Promise<CareerObjectiveModel[]> {
    return new Promise((resolve, reject) => {
      const careerObjectiveList = this.storageService.findAll(EntityEnum.CAREER_OBJECTIVE);
      const pncCareerObjectives = careerObjectiveList.filter(careerObjective => {
        if (AppConstant.ALL === careerObjectiveSearch.categoryId) {
          return careerObjective.pnc.matricule === careerObjectiveSearch.matricule
            && careerObjective.offlineAction !== OfflineActionEnum.DELETE;
        } else {
          return careerObjective.pnc.matricule === careerObjectiveSearch.matricule
            && careerObjective.offlineAction !== OfflineActionEnum.DELETE
            && careerObjective.category.id === careerObjectiveSearch.categoryId;
        }
      });
      resolve(pncCareerObjectives);
    });
  }

  /**
   * Récupère un objectif du cache à partir de son id
   * @param id l'id de l'objectif qu'on souhaite récupérer
   * @return une promesse contenant l'objectif récupéré
   */
  getCareerObjective(id: number): Promise<CareerObjectiveModel> {
    return this.storageService.findOneAsync(EntityEnum.CAREER_OBJECTIVE, `${id}`);
  }

  /**
   * Supprime du cache un objectif à partir de son id
   * @param id l'id de l'objectif à supprimer
   * @return une promesse contenant l'objectif supprimé
   */
  delete(id: number): Promise<CareerObjectiveModel> {
    return this.storageService.deleteAsync(EntityEnum.CAREER_OBJECTIVE, `${id}`);
  }

  /**
   * Vérifie si un objectif se trouve en cache
   * @param id l'id de l'objectif
   * @return vrai si l'objectif est trouvé en cache, faux sinon
   */
  careerObjectiveExists(id: number): boolean {
    return this.storageService.findOne(EntityEnum.CAREER_OBJECTIVE, `${id}`) !== null;
  }

  /**
   * Récupère les priorités rédigées
   * @param matricule matricule du rédacteur
   * @return une promesse nulle car la liste des priorités rédigées est indisponible hors ligne
   */
  public findCareerObjectivesByRedactor(matricule: string): Promise<CareerObjectiveModel[]> {
    return Promise.resolve(null);
  }
}
