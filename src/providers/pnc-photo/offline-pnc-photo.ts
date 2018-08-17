import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Injectable } from '@angular/core';
import { PncPhoto } from '../../models/PncPhoto';

@Injectable()
export class OfflinePncPhotoProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Sauvegarde la photo d'un PNC dans le cache
   * @param pncPhoto la photo à sauvegarder
   * @return une promesse contenant la photo sauvée
   */
  save(pncPhoto: PncPhoto): Promise<PncPhoto> {
    return this.storageService.saveAsync(Entity.PNC_PHOTO, pncPhoto);
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
