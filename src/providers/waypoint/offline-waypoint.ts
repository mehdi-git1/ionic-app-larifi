import { OfflineAction } from './../../models/offlineAction';
import { Entity } from './../../models/entity';
import { Waypoint } from './../../models/waypoint';
import { Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CareerObjective } from '../../models/careerObjective';

@Injectable()
export class OfflineWaypointProvider {

  constructor(private storageService: StorageService) {
  }

  /**
  * Stocke dans le cache un point d'étape
  * @param waypoint le point d'étape à stocker en cache
  * @param careerObjectiveId l'id de l'objectif du point d'étape
  * @return une promesse contenant le point d'étape mis en cache
  */
  store(waypoint: Waypoint, careerObjectiveId: number): Promise<Waypoint> {
    return this.createOrUpdate(waypoint, careerObjectiveId);
  }

  /**
   * Créé ou met à jour un point d'étape dans le cache
   * @param waypoint le point d'étape à sauver en cache
   * @param careerObjectiveId l'id de l'objectif du point d'étape
   * @param online si on est connecté ou non
   * @return une promesse contenant le point d'étape sauvé en cache
   */
  createOrUpdate(waypoint: Waypoint, careerObjectiveId: number, online: boolean = false): Promise<Waypoint> {
    waypoint.careerObjective = new CareerObjective();
    waypoint.careerObjective.techId = careerObjectiveId;
    return this.storageService.saveAsync(Entity.WAYPOINT, waypoint, online);
  }

  /**
   * Récupère la liste des point d'étapes d'un objectif à partir du cache
   * @param careerObjectiveId l'id de l'objectif dont on souhaite récupérer les point d'étapes
   * @return une promesse contenant les point d'étapes de l'objectif
   */
  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<Waypoint[]> {
    return new Promise((resolve, reject) => {
      const waypointList = this.storageService.findAll(Entity.WAYPOINT);
      resolve(waypointList.filter(waypoint => {
        return waypoint.careerObjective.techId === careerObjectiveId && waypoint.offlineAction !== OfflineAction.DELETE;
      }));
    });
  }

  /**
   * Récupère un point d'étape du cache à partir de son id
   * @param id l'id du point d'étape qu'on souhaite récupérer
   * @return une promesse contenant le point d'étape récupéré
   */
  getWaypoint(id: number): Promise<Waypoint> {
    return this.storageService.findOneAsync(Entity.WAYPOINT, `${id}`);
  }

  /**
   * Supprime du cache un point d'étape à partir de son id
   * @param id l'id du point d'étape à supprimer
   * @return une promesse contenant le point d'étape supprimé
   */
  delete(id: number): Promise<Waypoint> {
    return this.storageService.deleteAsync(Entity.WAYPOINT, `${id}`);
  }

}
