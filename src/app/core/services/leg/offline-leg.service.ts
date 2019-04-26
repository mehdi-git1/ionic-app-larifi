import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { CrewMemberModel } from '../../models/crew-member.model';
import { LegModel } from '../../models/leg.model';

@Injectable()
export class OfflineLegService {


  constructor(private storageService: StorageService) {
  }

  /**
  * Récupère les informations d'un leg
  * @param legId l'id du tronçon dont on souhaite avoir les informations
  * @return les informations du leg
  */
  getLeg(legId: number): Promise<LegModel> {
    return this.storageService.findOneAsync(EntityEnum.LEG, `${legId}`);
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMemberModel[]> {
    return new Promise((resolve, reject) => {
      const crewMembers = this.storageService.findAll(EntityEnum.CREW_MEMBER);
      resolve(crewMembers.filter(crewMember => crewMember.legId === legId));
    });
  }

  /**
   * Récupère la liste équipage d'un tronçon
   * @param company la compagnie
   * @param flightNumber le numéro de vol
   * @param date la date du vol
   * @param departureStation l'escale de départ
   * @return la liste équipage d'un tronçon
   */
  getCrewMembersFromLegWithoutId(company: string, flightNumber: string, date: string, departureStation: string): Promise<CrewMemberModel[]> {
    return new Promise((resolve, reject) => {
      const crewMembers = this.storageService.findAll(EntityEnum.CREW_MEMBER);
      resolve(crewMembers.filter(crewMember => crewMember.leg.company === company && crewMember.leg.number === flightNumber));
    });
  }

}
