import { NavParams } from 'ionic-angular';
import { CrewMember } from './../../models/CrewMember';
import { Config } from './../../configuration/environment-variables/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class LegProvider {

  private legUrl: string;

  constructor(public restService: RestService,
    public config: Config) {
    this.legUrl = `${config.backEndUrl}/legs`;
  }

  /**
  * Récupère les tronçons d'une rotation
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste des tronçons de la rotation
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMember[]> {
    return this.restService.get(`${this.legUrl}/${legId}/crew_members`);
  }

}
