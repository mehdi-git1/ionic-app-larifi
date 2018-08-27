import { WaypointTransformerProvider } from './waypoint-transformer';
import { StorageService } from './../../services/storage.service';
import { Config } from './../../configuration/environment-variables/config';
import { OfflineWaypointProvider } from './offline-waypoint';
import { ConnectivityService } from './../../services/connectivity.service';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Waypoint } from '../../models/waypoint';
import { Entity } from '../../models/entity';
import { OfflineProvider } from '../offline/offline';

@Injectable()
export class OnlineWaypointProvider {
  private waypointUrl: string;

  constructor(public restService: RestService,
    private connectivityService: ConnectivityService,
    private offlineWaypointProvider: OfflineWaypointProvider,
    private storageService: StorageService,
    private waypointTransformer: WaypointTransformerProvider,
    private offlineProvider: OfflineProvider,
    private config: Config) {
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
    return this.restService.get(`${this.waypointUrl}/career_objective/${careerObjectiveId}`);
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
