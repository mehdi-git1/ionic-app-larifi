import { Injectable } from '@angular/core';

import { ConnectivityService } from '../connectivity/connectivity.service';
import { BaseService } from '../base/base.service';
import { CrewMemberModel } from '../../models/crew-member.model';
import { OnlineLegService } from './online-leg.service';
import { OfflineLegService } from './offline-leg.service';
import { LegModel } from '../../models/leg.model';

@Injectable()
export class LegService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineLegProvider: OnlineLegService,
    private offlineLegProvider: OfflineLegService
  ) {
    super(
      connectivityService,
      onlineLegProvider,
      offlineLegProvider
    );
  }

  /**
  * Récupère les informations d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir les informations
  * @return les informations du leg
  */
  getLeg(legId: number): Promise<LegModel> {
    return this.execFunctionService('getLeg', legId);
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMemberModel[]> {
    return this.execFunctionService('getFlightCrewFromLeg', legId);
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
    return this.execFunctionService('getCrewMembersFromLegWithoutId', company, flightNumber, date, departureStation);
  }

}
