import { Injectable } from '@angular/core';

import { PncPhotoModel } from '../../models/pnc-photo.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OfflinePncPhotoService } from './offline-pnc-photo.service';
import { OnlinePncPhotoService } from './online-pnc-photo.service';

@Injectable({ providedIn: 'root' })
export class PncPhotoService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private offlinePncPhotoProvider: OfflinePncPhotoService,
    private onlinePncPhotoProvider: OnlinePncPhotoService
  ) {
    super(
      connectivityService,
      onlinePncPhotoProvider,
      offlinePncPhotoProvider
    );
  }

  /**
   * Retourne la photo d'un PNC
   * @param matricule le PNC concerné
   * @return la photo du PNC
   */
  getPncPhoto(matricule: string): Promise<PncPhotoModel> {
    return this.execFunctionService('getPncPhoto', matricule);
  }

  /**
   * Met à jour les photos d'une série de PNC, si ces dernières sont dépassées.
   * Stocke en cache les photos reçues et émet une événement pour déclencher la mise à jour des IHM
   * @param matricules les PNC concernés
   */
  synchronizePncsPhotos(matricules: string[]) {
    this.execFunctionService('synchronizePncsPhotos', matricules);
  }

}
