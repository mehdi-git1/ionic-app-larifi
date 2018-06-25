import { OnlinePncProvider } from './online-pnc';
import { OfflinePncProvider } from './../pnc/offline-pnc';
import { ConnectivityService } from './../../services/connectivity.service';
import { Rotation } from './../../models/rotation';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(private connectivityService: ConnectivityService,
    private onlinePncProvider: OnlinePncProvider,
    private offlinePncProvider: OfflinePncProvider) {
  }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @param storeOffline si on doit stocker le résultat de l'appel en local
   * @return les informations du PNC
   */
  getPnc(matricule: string, storeOffline: boolean = false): Promise<Pnc> {
    return this.connectivityService.isConnected() ?
      this.onlinePncProvider.getPnc(matricule, storeOffline) :
      this.offlinePncProvider.getPnc(matricule);
  }

  /**
   * Retrouve les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return les rotations à venir du PNC
   */
  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return this.connectivityService.isConnected() ?
      this.onlinePncProvider.getUpcomingRotations(matricule) :
      this.offlinePncProvider.getUpcomingRotations(matricule);
  }

  /**
  * Retrouve la dernière rotation opérée par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer la dernière rotation opérée
  * @return la dernière rotation opérée par le PNC
  */
  getLastPerformedRotation(matricule: string): Promise<Rotation> {
    return this.connectivityService.isConnected() ?
      this.onlinePncProvider.getLastPerformedRotation(matricule) :
      this.offlinePncProvider.getLastPerformedRotation(matricule);
  }

}

