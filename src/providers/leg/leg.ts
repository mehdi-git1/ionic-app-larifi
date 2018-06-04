import { NavParams } from 'ionic-angular';
import { CrewMember } from './../../models/CrewMember';
import { AppConfig } from './../../app/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class LegProvider {

  private legUrl: string;
  private legNumber: String;

  constructor(public restService: RestService) {
    this.legUrl = `${AppConfig.apiUrl}/legs`;
  }

  /**
  * Récupère les tronçons d'une rotation
  * @param rotation la rotation dont on souhaite récupérer les tronçons
  * @return la liste des tronçons de la rotation
  */
  getFlightCrewFromLeg(legNumber): Promise<CrewMember[]> {
    return this.restService.get(`${this.legUrl}/${legNumber}/flightCrew`);
    // return this.restService.get(`${this.legUrl}/16804/flightCrew`);
  }

}
