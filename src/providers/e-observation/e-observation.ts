import { OfflineEObservationProvider } from './offline-e-observation';
import { OnlineEObservationProvider } from './online-e-observation';
import { ConnectivityService } from './../../services/connectivity.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EObservation } from '../../models/eObservation';
import { BaseProvider } from '../base/base.provider';

@Injectable()
export class EObservationProvider extends BaseProvider {
  private eObservationUrl: string;

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineEObservationProvider: OnlineEObservationProvider,
    private offlineEObservationProvider: OfflineEObservationProvider
  ) {
    super(
      connectivityService,
      onlineEObservationProvider,
      offlineEObservationProvider
    );
  }

  /**
  * Récupère les infos d'une EObservation
  * @param matricule le matricule du PNC dont on souhaite récupérer l'EObservation
  * @param rotation le techId de rotation concernée
  * @return les informations du PNC
  */
  getEObservation(matricule: string, rotationId: number): Promise<EObservation> {
    return this.execFunctionProvider('getEObservation', matricule, rotationId);
  }

}
