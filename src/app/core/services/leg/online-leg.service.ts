import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { CrewMemberModel } from '../../models/crew-member.model';
import { LegModel } from '../../models/leg.model';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable()
export class OnlineLegService {

  constructor(
    private restService: RestService,
    private config: UrlConfiguration
  ) { }

  /**
  * Récupère les informations d'un leg
  * @param legId l'id du tronçon dont on souhaite avoir les informations
  * @return les informations du leg
  */
  getLeg(legId: number): Promise<LegModel> {
    return this.restService.get(this.config.getBackEndUrl('getLegsById', [legId]));
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMemberModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getLegsCrewMembersById', [legId]));
  }

  /**
   * Récupère la liste équipage d'un tronçon
   * @param company La compagnie du vol
   * @param flightNumber Le numéro du vol
   * @param date La date du vol
   * @param departureStation L'escale de départ'
   * @return une promesse contenant la liste équipage d'un tronçon
   */
  getCrewMembersFromLegWithoutId(company: string, flightNumber: string, date: string, departureStation: string): Promise<CrewMemberModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getCrewMembersFromLegWithoutId', [company, flightNumber, date, departureStation]));
  }

}
