import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Waypoint } from './../../models/waypoint';


@Injectable()
export class WaypointProvider {

  private waypointUrl: string;

  constructor(public restService: RestService) {
    this.waypointUrl = `${AppConfig.apiUrl}/waypoints`;
  }

  /**
   * Créé ou met à jour un point 'étape
   * @param  point d'étape à créer ou mettre à jour
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: Waypoint): Promise<Waypoint> {
    return this.restService.post(this.waypointUrl, waypoint);
  }

  /**
  * Récupère une liste de point d'étape
  * @param l'id de l'objectif
  * @return liste de point d'étape
  */
  getWaypointList(id: number): Promise<Waypoint[]> {
    return this.restService.get(`${this.waypointUrl}/career_objective/${id}`);
  }

  /**
  * Récupère un point d'étape
  * @param l'id du point d'étape
  * @return Point d'étape
  */
  getWaypoint(id: number): Promise<Waypoint> {
    return this.restService.get(`${this.waypointUrl}/${id}`);
  }


}
