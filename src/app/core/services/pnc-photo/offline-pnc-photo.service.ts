import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { PncPhotoModel } from '../../models/pnc-photo.model';

@Injectable()
export class OfflinePncPhotoService {

  constructor(private storageService: StorageService) {
  }

  /**
  * Retourne la photo d'un PNC
  * @param matricule le PNC concerné
  * @return la photo du PNC
  */
  getPncPhoto(matricule: string): Promise<PncPhotoModel> {
    return this.storageService.findOneAsync(EntityEnum.PNC_PHOTO, matricule);
  }

}
