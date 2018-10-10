import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { Injectable } from '@angular/core';
import { OnlineRotationProvider } from './online-rotation';
import { OfflineRotationProvider } from './offline-rotation';
import { ConnectivityService } from './../../services/connectivity.service';
import { BaseProvider } from '../base.provider';
@Injectable()
export class RotationProvider extends BaseProvider{
  private rotationUrl: string;

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineRotationProvider: OnlineRotationProvider,
    private offlineRotationProvider: OfflineRotationProvider
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
  getRotationLegs(rotation: Rotation): Promise<Leg[]> {
    return this.execFunctionProvider('getRotationLegs', rotation);
  }

}
