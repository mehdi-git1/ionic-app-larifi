import { CrewMember } from './../../models/crewMember';
import { Config } from './../../configuration/environment-variables/config';
import { Leg } from './../../models/leg';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class OnlineLegProvider {

  private legUrl: string;

  constructor(private restService: RestService,
    private config: Config) {
    this.legUrl = `${config.backEndUrl}/legs`;
  }

  /**
  * Récupère les informations d'un leg
  * @param legId l'id du tronçon dont on souhaite avoir les informations
  * @return les informations du leg
  */
  getLeg(legId: number): Promise<Leg> {
    return this.restService.get(`${this.legUrl}/${legId}`);
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMember[]> {
    return this.restService.get(`${this.legUrl}/${legId}/crew_members`);
  }
}
