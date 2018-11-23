import { Injectable } from '@angular/core';

import { RotationModel } from '../../models/rotation.model';
import { LegModel } from '../../models/leg.model';
import { OnlineRotationService } from './online-rotation.service';
import { OfflineRotationService } from './offline-rotation.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { BaseService } from '../base/base.service';

@Injectable()
export class RotationService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineRotationProvider: OnlineRotationService,
    private offlineRotationProvider: OfflineRotationService
  ) {
    super(
      connectivityService,
      onlineRotationProvider,
      offlineRotationProvider
    );
  }

  /**
  * Récupère les tronçons d'une rotation
  * @param rotation la rotation dont on souhaite récupérer les tronçons
  * @return la liste des tronçons de la rotation
  */
  getRotationLegs(rotation: RotationModel): Promise<LegModel[]> {
    return this.execFunctionProvider('getRotationLegs', rotation);
  }

}
