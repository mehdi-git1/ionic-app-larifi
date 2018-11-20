import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { OfflineActionEnum } from '../../enums/offline-action.enum';
import { EntityEnum } from '../../enums/entity.enum';
import { WaypointModel } from '../../models/waypoint.model';
import { StorageService } from '../../storage/storage.service';
import { CareerObjectiveModel } from '../../models/career-objective.model';

@Injectable()
export class OfflineWaypointService {

  constructor(private storageService: StorageService) {
  }

  /**
  * Stocke dans le cache un point d'étape
  * @param waypoint le point d'étape à stocker en cache
  * @param careerObjectiveId l'id de l'objectif du point d'étape
  * @return une promesse contenant le point d'étape mis en cache
  */
  store(waypoint: WaypointModel, careerObjectiveId: number): Promise<WaypointModel> {
    return this.createOrUpdate(waypoint, careerObjectiveId);
  }

  /**
   * Créé ou met à jour un point d'étape dans le cache
   * @param waypoint le point d'étape à sauver en cache
   * @param careerObjectiveId l'id de l'objectif du point d'étape
   * @param online si on est connecté ou non
   * @return une promesse contenant le point d'étape sauvé en cache
   */
  createOrUpdate(waypoint: WaypointModel, careerObjectiveId: number, online: boolean = false): Promise<WaypointModel> {
    const waypointToSave = _.cloneDeep(waypoint);
    waypointToSave.careerObjective = new CareerObjectiveModel();
    waypointToSave.careerObjective.techId = careerObjectiveId;
    return this.storageService.saveAsync(EntityEnum.WAYPOINT, waypointToSave, online);
  }

  /**
   * Récupère la liste des point d'étapes d'un objectif à partir du cache
   * @param careerObjectiveId l'id de l'objectif dont on souhaite récupérer les point d'étapes
   * @return une promesse contenant les point d'étapes de l'objectif
   */
  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<WaypointModel[]> {
    return new Promise((resolve, reject) => {
      const waypointList = this.storageService.findAll(EntityEnum.WAYPOINT);
      resolve(waypointList.filter(waypoint => {
        return waypoint.careerObjective.techId === careerObjectiveId && waypoint.offlineAction !== OfflineActionEnum.DELETE;
      }));
    });
  }

  /**
   * Récupère un point d'étape du cache à partir de son id
   * @param id l'id du point d'étape qu'on souhaite récupérer
   * @return une promesse contenant le point d'étape récupéré
   */
  getWaypoint(id: number): Promise<WaypointModel> {
    return this.storageService.findOneAsync(EntityEnum.WAYPOINT, `${id}`);
  }

  /**
   * Supprime du cache un point d'étape à partir de son id
   * @param id l'id du point d'étape à supprimer
   * @return une promesse contenant le point d'étape supprimé
   */
  delete(id: number): Promise<WaypointModel> {
    return this.storageService.deleteAsync(EntityEnum.WAYPOINT, `${id}`);
  }

}
