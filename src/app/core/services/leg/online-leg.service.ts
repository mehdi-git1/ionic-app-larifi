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
   * Récupère la liste équipage d'un tronçon
   * @param leg le tronçon duquel on souhaite récupérer la liste équipage
   * @return la liste équipage d'un tronçon
   */
  getCrewMembersFromLeg(leg: LegModel): Promise<CrewMemberModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getCrewMembersFromLeg', [leg.company, leg.number, leg.departureDate, leg.departureStation]));
  }

}
