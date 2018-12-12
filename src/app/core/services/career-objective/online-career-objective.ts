import { Injectable } from '@angular/core';
import { isUndefined } from 'ionic-angular/util/util';

import { StorageService } from '../../storage/storage.service';
import { EntityEnum } from '../../enums/entity.enum';
import { CareerObjectiveModel } from '../../models/career-objective.model';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import {OfflineCareerObjectiveService} from './offline-career-objective.service';
import {CareerObjectiveTransformerService} from './career-objective-transformer.service';

@Injectable()
export class OnlineCareerObjectiveService {

  constructor(
    public restService: RestService,
    private config: UrlConfiguration,
    private storageService: StorageService,
    private offlineCareerObjectiveService: OfflineCareerObjectiveService,
    private careerObjectiveTransformerService: CareerObjectiveTransformerService
  ) { }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @return la liste des objectifs du pnc
   */
  getPncCareerObjectives(matricule: string): Promise<CareerObjectiveModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getCareerObjectivesByPnc', [matricule]))
      .then(onlineCareerObjectives => {
        return this.offlineCareerObjectiveService.getPncCareerObjectives(matricule).then(offlineCareerObjectives => {
          const onlineData = this.careerObjectiveTransformerService.toCareerObjectives(onlineCareerObjectives);
          const offlineData = this.careerObjectiveTransformerService.toCareerObjectives(offlineCareerObjectives);
          return (this.addUnsynchronizedOfflineCareerObjectivesToOnline(onlineData, offlineData));
        });
      });
  }

  /**
 * Ajoute les objectifs créés en offline et non synchonisés, à la liste des objectifs récupérés de la BDD
 * @param onlineDataArray la liste des objectifs récupérés de la BDD.
 * @param offlineDataArray la liste des objectifs récupérés du cache
 */
  addUnsynchronizedOfflineCareerObjectivesToOnline(onlineDataArray: CareerObjectiveModel[], offlineDataArray: CareerObjectiveModel[]): CareerObjectiveModel[] {
    for (const offlineData of offlineDataArray) {
      const result = onlineDataArray.filter(onlineData => offlineData.getStorageId() === onlineData.getStorageId());
      if (result && result.length === 1) {
        if (offlineData.offlineAction && !isUndefined(offlineData.offlineAction)) {
          onlineDataArray[onlineDataArray.indexOf(result[0])] = offlineData;
        }
      } else if (offlineData.offlineAction && !isUndefined(offlineData.offlineAction)) {
        onlineDataArray.push(offlineData);
      }
    }
    return onlineDataArray;
  }

  /**
   * Créé ou met à jour un objectif
   * @param  careerObjective l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  createOrUpdate(careerObjective: CareerObjectiveModel): Promise<CareerObjectiveModel> {
    return this.restService.post(this.config.getBackEndUrl('careerObjectives'), careerObjective);
  }

  /**
  * Récupère un objectif
  * @param id l'id de l'objectif à récupérer
  * @return l'objectif récupéré
  */
  getCareerObjective(id: number): Promise<CareerObjectiveModel> {
    return this.restService.get(this.config.getBackEndUrl('getCareerObjectivesById', [id]));
  }


  /**
  * Supprime un objectif
  * @param id l'id de l'objectif à supprimer
  * @return l'objectif supprimé
  */
  delete(id: number): Promise<CareerObjectiveModel> {
    this.storageService.delete(EntityEnum.CAREER_OBJECTIVE, `${id}`);
    this.storageService.persistOfflineMap();
    return this.restService.delete(this.config.getBackEndUrl('deleteCareerObjectivesById', [id]));
  }

  /**
 * Envoi au serveur une demande de sollicitation instructeur pour l'objectif
 * @param id l'id de l'objectif pour lequel on souhaiter solliciter l'instructeur
 */
  createInstructorRequest(id: number): Promise<void> {
    return this.restService.post(this.config.getBackEndUrl('setCareerObjectivesInstructorRequestById', [id]), {});
  }

}
