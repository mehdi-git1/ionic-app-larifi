import { OnlineWaypointProvider } from './online-waypoint';
import { OfflineWaypointProvider } from './../waypoint/offline-waypoint';
import { ConnectivityService } from './../../services/connectivity.service';
import { Injectable } from '@angular/core';
import { Waypoint } from './../../models/waypoint';


@Injectable()
export class WaypointProvider {


  constructor(private connectivityService: ConnectivityService,
    private onlineWaypointProvider: OnlineWaypointProvider,
    private offlineWaypointProvider: OfflineWaypointProvider) {
  }

  /**
   * Créé ou met à jour un point d'étape
   * @param  waypoint le point d'étape à créer ou mettre à jour
   * @param careerObjectiveId l'id de l'objectif
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: Waypoint, careerObjectiveId: number): Promise<Waypoint> {
    return this.connectivityService.isConnected() ?
      this.onlineWaypointProvider.createOrUpdate(waypoint, careerObjectiveId) :
      this.offlineWaypointProvider.createOrUpdate(waypoint, careerObjectiveId);
  }

  /**
  * Récupère les points d'étape d'un objectif
  * @param careerObjectiveId l'id de l'objectif des points d'étape à récupérer
  * @param storeOffline si on doit stocker le résultat en local
  * @return les points d'étape récupérés
  */
  getCareerObjectiveWaypoints(careerObjectiveId: number, storeOffline: boolean = false): Promise<Waypoint[]> {
    return this.connectivityService.isConnected() ?
      this.onlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId, storeOffline) :
      this.offlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId);
  }

  /**
  * Récupère un point d'étape
  * @param id l'id du point d'étape à récupérer
  * @return le point d'étape récupéré
  */
  getWaypoint(id: number): Promise<Waypoint> {
    return this.connectivityService.isConnected() ?
      this.onlineWaypointProvider.getWaypoint(id) :
      this.offlineWaypointProvider.getWaypoint(id);
  }

  /**
  * Supprime un point d'étape
  * @param id l'id du point d'étape à supprimer
  * @return le point d'étape supprimé
  */
  delete(id: number): Promise<Waypoint> {
    return this.connectivityService.isConnected() ?
      this.onlineWaypointProvider.delete(id) :
      this.offlineWaypointProvider.delete(id);
  }
}
