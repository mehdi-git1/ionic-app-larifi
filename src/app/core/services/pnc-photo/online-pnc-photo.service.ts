
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { PncPhotoTransformerService } from './pnc-photo-transformer.service';
import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { AppConstant } from '../../../app.constant';
import { OfflinePncPhotoService } from './offline-pnc-photo.service';
import { PncPhotoModel } from '../../models/pnc-photo.model';


@Injectable()
export class OnlinePncPhotoService {

  constructor(
    private restService: RestService,
    private offlinePncPhotoProvider: OfflinePncPhotoService,
    private storageService: StorageService,
    private pncPhotoTransformer: PncPhotoTransformerService,
    private config: UrlConfiguration
  ) { }

  /**
  * Retourne la photo d'un PNC
  * @param matricule le PNC concerné
  * @return la photo du PNC
  */
  getPncPhoto(matricule: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.offlinePncPhotoProvider.getPncPhoto(matricule).then(pncPhoto => {
        if (!pncPhoto || this.photoIsExpired(pncPhoto)) {
          this.restService.get(this.config.getBackEndUrl('getPncPhotosByMatricule', [matricule])).then(onlinePncPhoto => {
            onlinePncPhoto = this.pncPhotoTransformer.toPncPhoto(onlinePncPhoto);
            this.storageService.save(EntityEnum.PNC_PHOTO, onlinePncPhoto);
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
  private photoIsExpired(pncPhoto: PncPhotoModel): boolean {
    const now = moment();
    const offlineStorageDate = moment(pncPhoto.offlineStorageDate, AppConstant.isoDateFormat);
    const offlineDuration = moment.duration(now.diff(offlineStorageDate)).asMilliseconds();

    const expiredThreshold = moment.duration(1, 'days').asMilliseconds();

    return offlineDuration > expiredThreshold;
  }
}