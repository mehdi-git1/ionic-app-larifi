import { OfflineProvider } from './../offline/offline';
import { Utils } from './../../common/utils';
import { PncPhotoTransformerProvider } from './pnc-photo-transformer';
import { OnlinePncPhotoProvider } from './online-pnc-photo';
import { OfflinePncPhotoProvider } from './offline-pnc-photo';
import { ConnectivityService } from './../../services/connectivity.service';
import { PncPhoto } from './../../models/pncPhoto';
import { Injectable } from '@angular/core';

@Injectable()
export class PncPhotoProvider {

  constructor(private connectivityService: ConnectivityService,
    private offlinePncPhotoProvider: OfflinePncPhotoProvider,
    private onlinePncPhotoProvider: OnlinePncPhotoProvider,
    private pncPhotoTransformerProvider: PncPhotoTransformerProvider,
    private offlineProvider: OfflineProvider
  ) {
  }

  /**
  * Retourne la photo d'un PNC
  * @param matricule le PNC concerné
  * @return la photo du PNC
  */
  getPncPhoto(matricule: string): Promise<PncPhoto> {
    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.offlinePncPhotoProvider.getPncPhoto(matricule).then(offlinePncPhoto => {
          this.onlinePncPhotoProvider.getPncPhoto(matricule).then(onlinePncPhoto => {
            try {
              if (!onlinePncPhoto || !onlinePncPhoto.photo) {
                resolve(null);
              }
              const file = new Blob([Utils.base64ToArrayBuffer(onlinePncPhoto.photo)], { type: 'image/png' });
              const onlineData = this.pncPhotoTransformerProvider.toPncPhotoFromBlob(file, matricule);
              const offlineData = this.pncPhotoTransformerProvider.toPncPhoto(offlinePncPhoto);
              this.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
              resolve(onlineData);
            } catch (error) {
            }
          },
            error => {
            });
        },
          error => {
          });
      });
    } else {
      return this.offlinePncPhotoProvider.getPncPhoto(matricule);
    }
  }

}
