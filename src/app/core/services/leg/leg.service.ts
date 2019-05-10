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
  * Récupère la liste équipage d'un tronçon
  * @param leg le tronçon duquel on souhaite récupérer la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getCrewMembersFromLeg(leg: LegModel): Promise<CrewMemberModel[]> {
    return this.execFunctionService('getCrewMembersFromLeg', leg);
  }

}
