import { Injectable } from '@angular/core';

import { Config } from './../../configuration/environment-variables/config';
import { CrewMember } from './../../models/crewMember';
import { Leg } from './../../models/leg';
import { RestService } from '../../services/rest/rest.base.service';

@Injectable()
export class OnlineLegProvider {

  constructor(
    private restService: RestService,
    private config: Config
  ) { }

  /**
  * Récupère les informations d'un leg
  * @param legId l'id du tronçon dont on souhaite avoir les informations
  * @return les informations du leg
  */
  getLeg(legId: number): Promise<Leg> {
    return this.restService.get(this.config.getBackEndUrl('getLegsById', [legId]));
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMember[]> {
    return this.restService.get(this.config.getBackEndUrl('getLegsCrewMembersById', [legId]));
  }

}
