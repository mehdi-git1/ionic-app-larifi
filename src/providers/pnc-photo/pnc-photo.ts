import { OnlinePncPhotoProvider } from './online-pnc-photo';
import { OfflinePncPhotoProvider } from './offline-pnc-photo';
import { ConnectivityService } from './../../services/connectivity.service';
import { PncPhoto } from './../../models/pncPhoto';
import { Injectable } from '@angular/core';

@Injectable()
export class PncPhotoProvider {

  constructor(private connectivityService: ConnectivityService,
    private offlinePncPhotoProvider: OfflinePncPhotoProvider,
    private onlinePncPhotoProvider: OnlinePncPhotoProvider
  ) {
  }

  /**
  * Retourne la photo d'un PNC
  * @param matricule le PNC concerné
  * @return la photo du PNC
  */
  getPncPhoto(matricule: string): Promise<PncPhoto> {
    return this.connectivityService.isConnected() ?
      this.onlinePncPhotoProvider.getPncPhoto(matricule) :
      this.offlinePncPhotoProvider.getPncPhoto(matricule);
  }

}
