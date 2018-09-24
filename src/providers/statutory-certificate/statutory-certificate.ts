import { OnlineStatutoryCertificateProvider } from './online-statutory-certificate';
import { ConnectivityService } from './../../services/connectivity.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatutoryCertificate } from '../../models/statutoryCertificate';

@Injectable()
export class StatutoryCertificateProvider {

  constructor(
    private connectivityService: ConnectivityService,
    private onlineStatutoryCertificateProvider: OnlineStatutoryCertificateProvider) {
  }

  /**
   * Récupère l'attestation réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer l'attestation réglementaire
   * @return l'attestation réglementaire du PNC
   */
  getStatutoryCertificate(matricule: string): Promise<StatutoryCertificate> {
    return this.connectivityService.isConnected() ?
      this.onlineStatutoryCertificateProvider.getStatutoryCertificate(matricule) :
      null;
  }
}
