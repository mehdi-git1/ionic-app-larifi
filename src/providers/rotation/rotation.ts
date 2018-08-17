import { LegTransformerProvider } from './../leg/leg-transformer';
import { OfflineProvider } from './../offline/offline';
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
    private offlineRotationProvider: OfflineRotationProvider,
    private offlineProvider: OfflineProvider,
    private legTransformer: LegTransformerProvider) {
  }

  /**
  * Récupère les tronçons d'une rotation
  * @param rotation la rotation dont on souhaite récupérer les tronçons
  * @return la liste des tronçons de la rotation
  */
  getRotationLegs(rotation: Rotation): Promise<Leg[]> {

    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.offlineRotationProvider.getRotationLegs(rotation).then(offlineLegs => {
          this.onlineRotationProvider.getRotationLegs(rotation).then(onlineLegs => {
            const onlineData = this.legTransformer.toLegs(onlineLegs);
            const offlineData = this.legTransformer.toLegs(offlineLegs);
            this.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
            resolve(onlineData);
          });
        });
      });
    } else {
      return this.offlineRotationProvider.getRotationLegs(rotation);
    }
  }
}
