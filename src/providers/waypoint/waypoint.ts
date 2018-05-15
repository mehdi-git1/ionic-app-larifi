import { HttpHeaders } from '@angular/common/http';
import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Waypoint } from './../../models/waypoint';


@Injectable()
export class WaypointProvider {

  private waypointUrl: string;
  private waypointUrlCreate: string;
  private headers: HttpHeaders;

  constructor(public restService: RestService) {
    this.waypointUrl = `${AppConfig.apiUrl}/waypoints`;
  }

  /**
   * Créé ou met à jour un point d'étape
   * @param  Waypoint le point d'étape à créer ou mettre à jour
   * @param Id de l'objectif
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: Waypoint, id: number): Promise<Waypoint> {
    return this.restService.post(`${this.waypointUrl}/career_objective/${id}`, waypoint);
  }

  /**
  * Récupère les points d'étape d'un objectif
  * @param Id de l'objectif des points d'étape à récupérer
  * @return les points d'étape récupérés
  */
  getCareerObjectiveWaypoints(id: number): Promise<Waypoint[]> {
    return this.restService.get(`${this.waypointUrl}/career_objective/${id}`);
  }

  /**
  * Récupère un point d'étape
  * @param Id du point d'étape à récupérer
  * @return le point d'étape récupéré
  */
  getWaypoint(id: number): Promise<Waypoint> {
    return this.restService.get(`${this.waypointUrl}/${id}`);
  }


}
