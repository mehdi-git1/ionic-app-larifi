import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
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

  /**
  * Récupère une rotation
  * @param rotation l'id de la rotation
  * @return la rotation demandée
  */
  getRotation(rotationId: string): Promise<Rotation> {
    return this.connectivityService.isConnected() ?
      this.onlineRotationProvider.getRotation(rotationId) :
      this.onlineRotationProvider.getRotation(rotationId);
  }
}
