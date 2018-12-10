import { Injectable } from '@angular/core';

import { ConnectivityService } from '../connectivity/connectivity.service';
import { BaseService } from '../base/base.service';
import { CrewMemberEnum } from '../../models/crew-member.enum';
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
  getFlightCrewFromLeg(legId: number): Promise<CrewMemberEnum[]> {
    return this.execFunctionService('getFlightCrewFromLeg', legId);
  }

}
