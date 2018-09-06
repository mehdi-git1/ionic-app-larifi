import { Config } from './../../configuration/environment-variables/config';
import { OfflineEObservationProvider } from './offline-e-observation';
import { OnlineEObservationProvider } from './online-e-observation';
import { ConnectivityService } from './../../services/connectivity.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EObservation } from '../../models/eObservation';

@Injectable()
export class EObservationProvider {
  private eObservationUrl: string;

  constructor(private connectivityService: ConnectivityService,
    private onlineEObservationProvider: OnlineEObservationProvider,
    private offlineEObservationProvider: OfflineEObservationProvider,
    private config: Config) {
  }

  /**
  * Récupère les infos d'une EObservation
  * @param matricule le matricule du PNC dont on souhaite récupérer l'EObservation
  * @param rotation le techId de rotation concernée
  * @return les informations du PNC
  */
  getEObservation(matricule: string, rotationId: number): Promise<EObservation> {
    return this.connectivityService.isConnected() ?
      this.onlineEObservationProvider.getEObservation(matricule, rotationId) :
      this.offlineEObservationProvider.getEObservation(matricule, rotationId);
  }

}
