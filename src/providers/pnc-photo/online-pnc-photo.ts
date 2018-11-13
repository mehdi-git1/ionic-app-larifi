import { PncPhotoTransformerProvider } from './pnc-photo-transformer';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { AppConstant } from './../../app/app.constant';
import { OfflinePncPhotoProvider } from './offline-pnc-photo';
import { PncPhoto } from './../../models/pncPhoto';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest/rest.base.service';
import * as moment from 'moment';

@Injectable()
export class OnlinePncPhotoProvider {

  private pncPhotoUrl: string;

  constructor(private restService: RestService,
    private offlinePncPhotoProvider: OfflinePncPhotoProvider,
    private storageService: StorageService,
    private pncPhotoTransformer: PncPhotoTransformerProvider,
    private config: Config) {
    this.pncPhotoUrl = `${config.backEndUrl}/pnc_photos`;
  }

  /**
  * Retourne la photo d'un PNC
  * @param matricule le PNC concerné
  * @return la photo du PNC
  */
  getPncPhoto(matricule: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.offlinePncPhotoProvider.getPncPhoto(matricule).then(pncPhoto => {
        if (!pncPhoto || this.photoIsExpired(pncPhoto)) {
          this.restService.get(`${this.pncPhotoUrl}/${matricule}`).then(onlinePncPhoto => {
            onlinePncPhoto = this.pncPhotoTransformer.toPncPhoto(onlinePncPhoto);
            this.storageService.save(Entity.PNC_PHOTO, onlinePncPhoto);
            resolve(onlinePncPhoto);
          }).catch(
            error => {
              reject(error);
            }
          );
        } else {
          resolve(pncPhoto);
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  /**
   * Vérifie si la photo est expirée. Elle l'est au delà de 24h
   * @return vrai si la photo est en cache depuis plus de 24h, faux sinon
   */
  private photoIsExpired(pncPhoto: PncPhoto): boolean {
    const now = moment();
    const offlineStorageDate = moment(pncPhoto.offlineStorageDate, AppConstant.isoDateFormat);
    const offlineDuration = moment.duration(now.diff(offlineStorageDate)).asMilliseconds();

    const expiredThreshold = moment.duration(1, 'days').asMilliseconds();

    return offlineDuration > expiredThreshold;
  }
}
