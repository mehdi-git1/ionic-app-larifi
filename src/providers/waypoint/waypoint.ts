import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Waypoint } from './../../models/waypoint';


@Injectable()
export class WaypointProvider {

  private waypointUrl: string;

  constructor(public restService: RestService) {
    this.waypointUrl = `${AppConfig.apiUrl}/waypoint`;
  }

  /**
   * Créé ou met à jour un point d'étape
   * @param  waypoint le point d'étape à créer ou mettre à jour
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: Waypoint): Promise<Waypoint> {
    return this.restService.post(this.waypointUrl, waypoint);
  }

  /**
  * Récupère les points d'étape d'un objectif
  * @param id l'id de l'objectif des points d'étape à récupérer
  * @return les points d'étape récupérés
  */
  getListWaypoint(idCareerObjective: number): Promise<Waypoint[]> {
    return this.restService.get(`${this.waypointUrl}/careerObjective/${idCareerObjective}`);
  }

  /**
  * Récupère un point d'étape
  * @param id l'id du point d'étape à récupérer
  * @return le point d'étape récupéré
  */
  getWaypoint(id: number): Promise<Waypoint> {
    return this.restService.get(`${this.waypointUrl}/${id}`);
  }


}
