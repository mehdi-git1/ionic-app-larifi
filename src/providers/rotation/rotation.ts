import { RotationTransformerProvider } from './rotation-transformer';
import { LegTransformerProvider } from './../leg/leg-transformer';
import { OfflineProvider } from './../offline/offline';
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
    private offlineProvider: OfflineProvider,
    private legTransformer: LegTransformerProvider,
    private rotationTransformer: RotationTransformerProvider,
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
          for (const leg of onlineData) {
            this.legProvider.refresh(leg);
          }
          resolve(onlineData);
        });
      });
    } else {
      return this.offlineRotationProvider.getRotationLegs(rotation);
    }
  }

  /**
   * Met à jour la date de mise en cache dans l'objet online
   * @param rotation objet online
   */
  refresh(rotation: Rotation) {
    this.offlineRotationProvider.getRotation(rotation.techId).then(offlineRotation => {
      const offlineData = this.rotationTransformer.toRotation(offlineRotation);
      this.offlineProvider.flagDataAvailableOffline(rotation, offlineData);
    });
  }
}
