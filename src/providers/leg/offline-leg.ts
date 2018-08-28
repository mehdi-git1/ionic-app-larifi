import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { CrewMember } from './../../models/crewMember';
import { Leg } from './../../models/leg';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineLegProvider {

  private legUrl: string;

  constructor(private storageService: StorageService) {
  }

  /**
  * Récupère les informations d'un leg
  * @param legId l'id du tronçon dont on souhaite avoir les informations
  * @return les informations du leg
  */
  getLeg(legId: number): Promise<Leg> {
    return this.storageService.findOneAsync(Entity.LEG, `${legId}`);
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMember[]> {
    return new Promise((resolve, reject) => {
      const crewMembers = this.storageService.findAll(Entity.CREW_MEMBER);
      resolve(crewMembers.filter(crewMember => crewMember.legId === legId));
    });
  }

}
