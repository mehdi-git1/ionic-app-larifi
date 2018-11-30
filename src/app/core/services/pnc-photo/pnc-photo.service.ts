import { OnlinePncPhotoService } from './online-pnc-photo.service';
import { OfflinePncPhotoService } from './offline-pnc-photo.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { PncPhotoModel } from '../../models/pnc-photo.model';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable()
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

}
