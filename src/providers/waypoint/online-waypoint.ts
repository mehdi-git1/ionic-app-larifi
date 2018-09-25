import { Injectable } from '@angular/core';

import { OfflineWaypointProvider } from './offline-waypoint';
import { WaypointTransformerProvider } from './waypoint-transformer';
import { StorageService } from './../../services/storage.service';
import { Config } from './../../configuration/environment-variables/config';
import { RestService } from '../../services/rest.base.service';
import { Waypoint } from '../../models/waypoint';
import { Entity } from '../../models/entity';
import { isUndefined } from 'ionic-angular/util/util';

@Injectable()
export class OnlineWaypointProvider {
  private waypointUrl: string;

  constructor(
    public restService: RestService,
    private storageService: StorageService,
    private config: Config,
    private waypointTransformerProvider: WaypointTransformerProvider,
    private offlineWaypointProvider: OfflineWaypointProvider
  ) {
    this.waypointUrl = `${config.backEndUrl}/waypoints`;
  }

  /**
   * Créé ou met à jour un point d'étape
   * @param  waypoint le point d'étape à créer ou mettre à jour
   * @param careerObjectiveId l'id de l'objectif
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: Waypoint, careerObjectiveId: number): Promise<Waypoint> {
    return this.restService.post(`${this.waypointUrl}/career_objective/${careerObjectiveId}`, waypoint);
  }

  /**
  * Récupère les points d'étape d'un objectif
  * @param careerObjectiveId l'id de l'objectif des points d'étape à récupérer
  * @return les points d'étape récupérés
  */
  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<Waypoint[]> {
    return this.restService.get(`${this.waypointUrl}/career_objective/${careerObjectiveId}`)
      .then(onlineCareerObjectiveWaypoints => {
       return this.offlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId)
          .then(offlineCareerObjectiveWaypoints => {
        const onlineData = this.waypointTransformerProvider.toWaypoints(onlineCareerObjectiveWaypoints);
        const offlineData = this.waypointTransformerProvider.toWaypoints(offlineCareerObjectiveWaypoints);
        return (this.addUnsynchronizedOfflineCareerObjectivesToOnline(onlineData, offlineData));
      });
    });
  }

  /**
   * Ajoute les points d'étape créés en offline et non synchonisés, à la liste des points d'étape récupérés de la BDD
   * @param onlineDataArray la liste des points d'étape récupérés de la BDD.
   * @param offlineDataArray la liste des points d'étape récupérés du cache
   */
  addUnsynchronizedOfflineCareerObjectivesToOnline(onlineDataArray: Waypoint[], offlineDataArray: Waypoint[]): Waypoint[] {
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
  * Récupère un point d'étape
  * @param id l'id du point d'étape à récupérer
  * @return le point d'étape récupéré
  */
  getWaypoint(id: number): Promise<Waypoint> {
    return this.restService.get(`${this.waypointUrl}/${id}`);
  }

  /**
  * Supprime un point d'étape
  * @param id l'id du point d'étape à supprimer
  * @return le point d'étape supprimé
  */
  delete(id: number): Promise<Waypoint> {
    this.storageService.delete(Entity.WAYPOINT, `${id}`);
    this.storageService.persistOfflineMap();
    return this.restService.delete(`${this.waypointUrl}/${id}`);
  }

}
