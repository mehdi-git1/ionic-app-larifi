import { OnlinePncPhotoProvider } from './online-pnc-photo';
import { OfflinePncPhotoProvider } from './offline-pnc-photo';
import { ConnectivityService } from '../../../../services/connectivity/connectivity.service';
import { PncPhoto } from '../../models/pncPhoto';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base.provider';

@Injectable()
export class PncPhotoProvider extends BaseProvider {

  constructor(
    protected connectivityService: ConnectivityService,
    private offlinePncPhotoProvider: OfflinePncPhotoProvider,
    private onlinePncPhotoProvider: OnlinePncPhotoProvider
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
  getPncPhoto(matricule: string): Promise<PncPhoto> {
    return this.execFunctionProvider('getPncPhoto', matricule);
  }

}
