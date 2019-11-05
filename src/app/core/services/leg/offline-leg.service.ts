import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { CrewMemberModel } from '../../models/crew-member.model';
import { LegModel } from '../../models/leg.model';
import { StorageService } from '../../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class OfflineLegService {


  constructor(private storageService: StorageService) {
  }

  /**
   * Récupère la liste équipage d'un tronçon
   * @param leg le tronçon duquel on souhaite récupérer la liste équipage
   * @return la liste équipage d'un tronçon
   */
  getCrewMembersFromLeg(leg: LegModel): Promise<CrewMemberModel[]> {
    let crewMembers = this.storageService.findAll(EntityEnum.CREW_MEMBER);
    crewMembers = crewMembers.filter(crewMember => crewMember.leg.company === leg.company && crewMember.leg.number === leg.number && crewMember.leg.departureDate === leg.departureDate);
    return Promise.resolve(crewMembers);
  }

}
