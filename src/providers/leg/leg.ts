import { CrewMember } from './../../models/crewMember';
import { Config } from './../../configuration/environment-variables/config';
import { OnlineLegProvider } from './online-leg';
import { OfflineLegProvider } from './offline-leg';
import { Leg } from './../../models/leg';
import { Injectable } from '@angular/core';
import { ConnectivityService } from './../../services/connectivity.service';

@Injectable()
export class LegProvider {

  private legUrl: string;

  constructor(private connectivityService: ConnectivityService,
    private onlineLegProvider: OnlineLegProvider,
    private offlineLegProvider: OfflineLegProvider) {
  }

  /**
  * Récupère les informations d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir les informations
  * @return les informations du leg
  */
  getLeg(legId: number): Promise<Leg> {
    return this.connectivityService.isConnected() ?
      this.onlineLegProvider.getLeg(legId) :
      this.offlineLegProvider.getLeg(legId);
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMember[]> {
    return this.connectivityService.isConnected() ?
      this.onlineLegProvider.getFlightCrewFromLeg(legId) :
      this.offlineLegProvider.getFlightCrewFromLeg(legId);
  }
}
