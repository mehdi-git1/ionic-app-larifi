import { Config } from './../../configuration/environment-variables/config';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Waypoint } from './../../models/waypoint';


@Injectable()
export class WaypointProvider {

  private waypointUrl: string;

  constructor(public restService: RestService,
    private config: Config) {
    this.waypointUrl = `${config.backEndUrl}/waypoints`;
  }

  /**
   * Créé ou met à jour un point d'étape
   * @param  waypoint le point d'étape à créer ou mettre à jour
   * @param id l'id de l'objectif
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: Waypoint, id: number): Promise<Waypoint> {
    return this.restService.post(`${this.waypointUrl}/career_objective/${id}`, waypoint);
  }

  /**
  * Récupère les points d'étape d'un objectif
  * @param id l'id de l'objectif des points d'étape à récupérer
  * @param storeOffline si on doit stocker le résultat en local
  * @return les points d'étape récupérés
  */
  getCareerObjectiveWaypoints(id: number, storeOffline: boolean = false): Promise<Waypoint[]> {
    return this.restService.get(`${this.waypointUrl}/career_objective/${id}`, null, null, storeOffline);
  }

  /**
  * Récupère un point d'étape
  * @param id l'id du point d'étape à récupérer
  * @param storeOffline si on doit stocker le résultat en local
  * @return le point d'étape récupéré
  */
  getWaypoint(id: number, storeOffline: boolean = false): Promise<Waypoint> {
    return this.restService.get(`${this.waypointUrl}/${id}`, null, null, storeOffline);
  }

  /**
  * Supprime un point d'étape
  * @param id l'id du point d'étape à supprimer
  * @return le point d'étape supprimé
  */
  delete(id: number): Promise<Waypoint> {
    return this.restService.delete(`${this.waypointUrl}/${id}`);
  }


}
