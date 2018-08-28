import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { Injectable } from '@angular/core';
import { OnlineRotationProvider } from './online-rotation';
import { OfflineRotationProvider } from './offline-rotation';
import { ConnectivityService } from './../../services/connectivity.service';
@Injectable()
export class RotationProvider {

  private rotationUrl: string;


  constructor(private connectivityService: ConnectivityService,
    private onlineRotationProvider: OnlineRotationProvider,
    private offlineRotationProvider: OfflineRotationProvider) {
  }

  /**
  * Récupère les tronçons d'une rotation
  * @param rotation la rotation dont on souhaite récupérer les tronçons
  * @return la liste des tronçons de la rotation
  */
  getRotationLegs(rotation: Rotation): Promise<Leg[]> {

    return this.connectivityService.isConnected() ?
      this.onlineRotationProvider.getRotationLegs(rotation) :
      this.offlineRotationProvider.getRotationLegs(rotation);
  }

}
