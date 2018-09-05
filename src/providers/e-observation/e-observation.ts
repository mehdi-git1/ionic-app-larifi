import { OfflineEObservationProvider } from './offline-e-observation';
import { OnlineEObservationProvider } from './online-e-observation';
import { Config } from './../../configuration/environment-variables/rct';
import { ConnectivityService } from './../../services/connectivity.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EObservation } from '../../models/eObservation';

/*
  Generated class for the EObservationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
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
  getEObservation(matricule: string, rotation: number): Promise<EObservation> {
    return this.connectivityService.isConnected() ?
      this.onlineEObservationProvider.getEObservation(matricule, rotation) :
      this.offlineEObservationProvider.getEObservation(matricule, rotation);
  }

}
