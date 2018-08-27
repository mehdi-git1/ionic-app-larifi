import { LegTransformerProvider } from './../leg/leg-transformer';
import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { OnlineRotationProvider } from './online-rotation';
import { OfflineRotationProvider } from './offline-rotation';
import { ConnectivityService } from './../../services/connectivity.service';
import { LegProvider } from '../leg/leg';
@Injectable()
export class RotationProvider {

  private rotationUrl: string;


  constructor(private connectivityService: ConnectivityService,
    private onlineRotationProvider: OnlineRotationProvider,
    private offlineRotationProvider: OfflineRotationProvider,
    private legTransformer: LegTransformerProvider,
    private legProvider: LegProvider) {
  }

  /**
  * Récupère les tronçons d'une rotation
  * @param rotation la rotation dont on souhaite récupérer les tronçons
  * @return la liste des tronçons de la rotation
  */
  getRotationLegs(rotation: Rotation): Promise<Leg[]> {

    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.onlineRotationProvider.getRotationLegs(rotation).then(onlineLegs => {
          const onlineData = this.legTransformer.toLegs(onlineLegs);
          resolve(onlineData);
        });
      });
    } else {
      return this.offlineRotationProvider.getRotationLegs(rotation);
    }
  }

}
