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

  createOrUpdate(waypoint: Waypoint): Promise<Waypoint> {
    return this.restService.post(this.waypointUrl, waypoint);
  }


  getListWaypoint(idCareerObjective: number): Promise<Waypoint[]> {
    return this.restService.get(`${this.waypointUrl}/careerObjective/${idCareerObjective}`);
  }


  getWaypoint(id: number): Promise<Waypoint> {
    return this.restService.get(`${this.waypointUrl}/${id}`);
  }


}
