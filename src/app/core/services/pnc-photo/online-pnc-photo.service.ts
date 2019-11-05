import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { AppConstant } from '../../../app.constant';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { EntityEnum } from '../../enums/entity.enum';
import { RestService } from '../../http/rest/rest.base.service';
import { MatriculesModel } from '../../models/matricules.model';
import { PncPhotoModel } from '../../models/pnc-photo.model';
import { StorageService } from '../../storage/storage.service';
import { OfflinePncPhotoService } from './offline-pnc-photo.service';
import { PncPhotoTransformerService } from './pnc-photo-transformer.service';

@Injectable({ providedIn: 'root' })
export class OnlinePncPhotoService {

  constructor(
    private restService: RestService,
    private offlinePncPhotoService: OfflinePncPhotoService,
    private storageService: StorageService,
    private pncPhotoTransformer: PncPhotoTransformerService,
    private config: UrlConfiguration,
    private events: Events
  ) { }

  /**
   * Retourne la photo d'un PNC
   * @param matricule le PNC concerné
   * @return la photo du PNC
   */
  getPncPhoto(matricule: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.offlinePncPhotoService.getPncPhoto(matricule).then(pncPhoto => {
        if (!pncPhoto || this.photoIsExpired(pncPhoto)) {
          this.restService.get(this.config.getBackEndUrl('getPncPhotoByMatricule', [matricule])).then(onlinePncPhoto => {
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
   * Met à jour les photos d'une série de PNC, si ces dernières sont dépassées.
   * Stocke en cache les photos reçues et émet un événement pour déclencher la mise à jour des photos
   * @param matricules les PNC concernés
   */
  synchronizePncsPhotos(matricules: string[]): Promise<any> {
    this.offlinePncPhotoService.getPncsPhotos(matricules).then(pncsPhotos => {
      const expiredPhotoMatricules: Array<string> = new Array();
      pncsPhotos.forEach(pncPhoto => {
        if (!pncPhoto || this.photoIsExpired(pncPhoto)) {
          expiredPhotoMatricules.push(pncPhoto.matricule);
        }
      });
      if (expiredPhotoMatricules.length > 0) {
        const matriculesObject = new MatriculesModel(expiredPhotoMatricules);
        matriculesObject.matricules = expiredPhotoMatricules;
        this.restService.get(this.config.getBackEndUrl('pncPhotos'), matriculesObject).then(onlinePncsPhotos => {
          onlinePncsPhotos.forEach(onlinePncPhoto => {
            onlinePncPhoto = this.pncPhotoTransformer.toPncPhoto(onlinePncPhoto);
            this.storageService.save(EntityEnum.PNC_PHOTO, onlinePncPhoto);
          });
          this.storageService.persistOfflineMap();
        }, error => { }).then(() => {
          this.events.publish('PncPhoto:updated', matricules);
        });
      } else {
        this.events.publish('PncPhoto:updated', matricules);
      }
    });
    return Promise.resolve();
  }

  /**
   * Vérifie si la photo est expirée. Elle l'est au delà de 24h
   * @return vrai si la photo est en cache depuis plus de 24h, faux sinon
   */
  private photoIsExpired(pncPhoto: PncPhotoModel): boolean {
    if (pncPhoto && pncPhoto.offlineStorageDate) {
      const now = moment();
      const offlineStorageDate = moment(pncPhoto.offlineStorageDate, AppConstant.isoDateFormat);
      const offlineDuration = moment.duration(now.diff(offlineStorageDate)).asMilliseconds();

      const expiredThreshold = moment.duration(1, 'days').asMilliseconds();

      return offlineDuration > expiredThreshold;
    }
    return true;
  }
}
