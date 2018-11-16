import { Entity } from '../../models/entity';
import { StorageService } from '../../../../services/storage.service';
import { Injectable } from '@angular/core';
import { PncPhoto } from '../../models/pncPhoto';

@Injectable()
export class OfflinePncPhotoProvider {

  constructor(private storageService: StorageService) {
  }

  /**
  * Retourne la photo d'un PNC
  * @param matricule le PNC concerné
  * @return la photo du PNC
  */
  getPncPhoto(matricule: string): Promise<PncPhoto> {
    return this.storageService.findOneAsync(Entity.PNC_PHOTO, matricule);
  }

}
