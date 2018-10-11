import { CrewMember } from './../../models/crewMember';
import { OnlineLegProvider } from './online-leg';
import { OfflineLegProvider } from './offline-leg';
import { Leg } from './../../models/leg';
import { Injectable } from '@angular/core';
import { ConnectivityService } from './../../services/connectivity.service';
import { BaseProvider } from '../base/base.provider';

@Injectable()
export class LegProvider extends BaseProvider {

  private legUrl: string;

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineLegProvider: OnlineLegProvider,
    private offlineLegProvider: OfflineLegProvider
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
  getLeg(legId: number): Promise<Leg> {
    return this.execFunctionProvider('getLeg', legId);
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMember[]> {
    return this.execFunctionProvider('getFlightCrewFromLeg', legId);
  }

}
