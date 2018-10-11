import { OfflineStatutoryCertificateProvider } from './offline-statutory-certificate';
import { OnlineStatutoryCertificateProvider } from './online-statutory-certificate';
import { ConnectivityService } from './../../services/connectivity.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatutoryCertificate } from '../../models/statutoryCertificate';
import { BaseProvider } from '../base/base.provider';

@Injectable()
export class StatutoryCertificateProvider extends BaseProvider {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineStatutoryCertificateProvider: OnlineStatutoryCertificateProvider,
    private offlineStatutoryCertificateProvider: OfflineStatutoryCertificateProvider) {
    super(
      connectivityService,
      onlineStatutoryCertificateProvider,
      offlineStatutoryCertificateProvider
    );
  }

  /**
   * Récupère l'attestation réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer l'attestation réglementaire
   * @return l'attestation réglementaire du PNC
   */
  getStatutoryCertificate(matricule: string): Promise<StatutoryCertificate> {
    return this.execFunctionProvider('getStatutoryCertificate', matricule);
  }
}
