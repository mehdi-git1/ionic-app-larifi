import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { EntityEnum } from '../../enums/entity.enum';
import { RestService } from '../../http/rest/rest.base.service';
import { WaypointModel } from '../../models/waypoint.model';
import { StorageService } from '../../storage/storage.service';
import { OfflineWaypointService } from './offline-waypoint.service';
import { WaypointTransformerService } from './waypoint-transformer.service';

@Injectable({ providedIn: 'root' })
export class OnlineWaypointService {

  constructor(
    public restService: RestService,
    private storageService: StorageService,
    private config: UrlConfiguration,
    private waypointTransformerProvider: WaypointTransformerService,
    private offlineWaypointProvider: OfflineWaypointService
  ) { }

  /**
   * Créé ou met à jour un point d'étape
   * @param  waypoint le point d'étape à créer ou mettre à jour
   * @param careerObjectiveId l'id de l'objectif
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: WaypointModel, careerObjectiveId: number): Promise<WaypointModel> {
    return this.restService.post(this.config.getBackEndUrl('crudWaypointByCarreObjectiveId', [careerObjectiveId]), waypoint);
  }

  /**
   * Récupère les points d'étape d'un objectif
   * @param careerObjectiveId l'id de l'objectif des points d'étape à récupérer
   * @return les points d'étape récupérés
   */
  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<WaypointModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getWaypointsByCarreObjectiveId', [careerObjectiveId]))
      .then(onlineCareerObjectiveWaypoints => {
        return this.offlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId)
          .then(offlineCareerObjectiveWaypoints => {
            const onlineData = this.waypointTransformerProvider.toWaypoints(onlineCareerObjectiveWaypoints);
            const offlineData = this.waypointTransformerProvider.toWaypoints(offlineCareerObjectiveWaypoints);
            return (this.addUnsynchronizedOfflineWayPointToOnline(onlineData, offlineData));
          });
      });
  }

  /**
   * Ajoute les points d'étape créés en offline et non synchonisés, à la liste des points d'étape récupérés de la BDD
   * @param onlineDataArray la liste des points d'étape récupérés de la BDD.
   * @param offlineDataArray la liste des points d'étape récupérés du cache
   */
  addUnsynchronizedOfflineWayPointToOnline(onlineDataArray: WaypointModel[], offlineDataArray: WaypointModel[]): WaypointModel[] {
    for (const offlineData of offlineDataArray) {
      const result = onlineDataArray.filter(onlineData => offlineData.getStorageId() === onlineData.getStorageId());
      if (result && result.length === 1) {
        if (offlineData.offlineAction && offlineData.offlineAction !== undefined) {
          onlineDataArray[onlineDataArray.indexOf(result[0])] = offlineData;
        }
      } else if (offlineData.offlineAction && offlineData.offlineAction !== undefined) {
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
  getWaypoint(id: number): Promise<WaypointModel> {
    return this.restService.get(this.config.getBackEndUrl('getWaypointById', [id]));
  }

  /**
   * Supprime un point d'étape
   * @param id l'id du point d'étape à supprimer
   * @return le point d'étape supprimé
   */
  delete(id: number): Promise<WaypointModel> {
    const wayPointPromise = this.restService.delete(this.config.getBackEndUrl('deleteWaypointsById', [id]));

    wayPointPromise.then(() => {
      this.storageService.delete(EntityEnum.WAYPOINT, `${id}`);
      this.storageService.persistOfflineMap();
    });

    return wayPointPromise;
  }

}
