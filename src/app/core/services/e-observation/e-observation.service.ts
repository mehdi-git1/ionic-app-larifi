import { Injectable } from '@angular/core';
import { EObservationModel } from '../../models/e-observation.model';
import { BaseService } from '../base/base.service';

import { OfflineEObservationService } from './offline-e-observation.service';
import { OnlineEObservationService } from './online-e-observation.service';
import { ConnectivityService } from '../connectivity/connectivity.service';

@Injectable()
export class EObservationService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineEObservationService: OnlineEObservationService,
    private offlineEObservationService: OfflineEObservationService
  ) {
    super(
      connectivityService,
      onlineEObservationService,
      offlineEObservationService
    );
  }

  /**
  * Récupère les infos d'une EObservationModel
  * @param matricule le matricule du PNC dont on souhaite récupérer l'EObservationModel
  * @param rotation le techId de rotation concernée
  * @return les informations du PNC
  */
  getEObservation(matricule: string, rotationId: number): Promise<EObservationModel> {
    return this.execFunctionProvider('getEObservation', matricule, rotationId);
  }

}
