import { CareerObjectiveTransformerProvider } from './career-objective-transformer';
import { OfflineCareerObjectiveProvider } from './offline-career-objective';
import { StorageService } from './../../services/storage.service';
import { Entity } from './../../models/entity';
import { CareerObjective } from './../../models/careerObjective';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { isUndefined } from 'ionic-angular/util/util';

@Injectable()
export class OnlineCareerObjectiveProvider {
  private careerObjectiveUrl: string;


  constructor(
    public restService: RestService,
    private config: Config,
    private storageService: StorageService,
    private offlineCareerObjectiveProvider: OfflineCareerObjectiveProvider,
    private careerObjectiveTransformer: CareerObjectiveTransformerProvider
  ) {
    this.careerObjectiveUrl = `${config.backEndUrl}/career_objectives`;
  }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @return la liste des objectifs du pnc
   */
  getPncCareerObjectives(matricule: string): Promise<CareerObjective[]> {
    return this.restService.get(`${this.careerObjectiveUrl}/pnc/${matricule}`)
    .then(onlineCareerObjectives => {
      return this.offlineCareerObjectiveProvider.getPncCareerObjectives(matricule).then(offlineCareerObjectives => {
        const onlineData = this.careerObjectiveTransformer.toCareerObjectives(onlineCareerObjectives);
        const offlineData = this.careerObjectiveTransformer.toCareerObjectives(offlineCareerObjectives);
        return (this.addUnsynchronizedOfflineCareerObjectivesToOnline(onlineData, offlineData));
      });
    });
  }

    /**
   * Ajoute les objectifs créés en offline et non synchonisés, à la liste des objectifs récupérés de la BDD
   * @param onlineDataArray la liste des objectifs récupérés de la BDD.
   * @param offlineDataArray la liste des objectifs récupérés du cache
   */
  addUnsynchronizedOfflineCareerObjectivesToOnline(onlineDataArray: CareerObjective[], offlineDataArray: CareerObjective[]): CareerObjective[] {
    for (const offlineData of offlineDataArray) {
      const result = onlineDataArray.filter(onlineData => offlineData.getStorageId() === onlineData.getStorageId());
      if (result && result.length === 1) {
        if (!isUndefined(offlineData.offlineAction)) {
          onlineDataArray[onlineDataArray.indexOf(result[0])] = offlineData;
        }
      } else {
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

  /**
  * Supprime un objectif
  * @param id l'id de l'objectif à supprimer
  * @return l'objectif supprimé
  */
  delete(id: number): Promise<CareerObjective> {
    this.storageService.delete(Entity.CAREER_OBJECTIVE, `${id}`);
    this.storageService.persistOfflineMap();
    return this.restService.delete(`${this.careerObjectiveUrl}/${id}`);
  }

  /**
 * Envoi au serveur une demande de sollicitation instructeur pour l'objectif
 * @param id l'id de l'objectif pour lequel on souhaiter solliciter l'instructeur
 */
  createInstructorRequest(id: number): Promise<void> {
    return this.restService.post(`${this.careerObjectiveUrl}/${id}/instructor_request`, {});
  }

}
