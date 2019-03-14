import { MatriculesModel } from './../../models/matricules.model';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { PncPhotoModel } from '../../models/pnc-photo.model';

@Injectable()
export class OfflinePncPhotoService {

  constructor(private storageService: StorageService,
    private events: Events) {
  }

  /**
  * Retourne la photo d'un PNC
  * @param matricule le PNC concerné
  * @return la photo du PNC
  */
  getPncPhoto(matricule: string): Promise<PncPhotoModel> {
    return this.storageService.findOneAsync(EntityEnum.PNC_PHOTO, matricule);
  }


  /**
  * Retourne les photos d'une liste de PNC
  * @param matricules les PNC concernés
  * @return les photos des PNC
  */
  getPncsPhotos(matricules: string[]): Promise<PncPhotoModel[]> {
    const pncsPhotos: PncPhotoModel[] = new Array();
    return new Promise(resolve => {
      matricules.forEach(matricule => {
        let pncPhoto = this.storageService.findOne(EntityEnum.PNC_PHOTO, matricule);
        if (!pncPhoto) {
          pncPhoto = new PncPhotoModel();
          pncPhoto.matricule = matricule;
          pncPhoto.offlineStorageDate = null;
        }
        pncsPhotos.push(pncPhoto);
      });
      resolve(pncsPhotos);
    });
  }

  /**
   * Met à jour les photos d'une série de PNC, si ces dernières sont dépassées.
   * En offline, on émet simplement l'événement afin de déclencher une récupération des photos en cache
   * @param matricules les PNC concernés
   */
  synchronizePncsPhotos(matricules: string[]): void {
    this.events.publish('PncPhoto:updated', matricules);
  }

}
