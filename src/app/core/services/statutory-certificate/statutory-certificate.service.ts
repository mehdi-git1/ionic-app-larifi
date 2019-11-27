import { Injectable } from '@angular/core';

import { StatutoryCertificateModel } from '../../models/statutory.certificate.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OfflineStatutoryCertificateService } from './offline-statutory-certificate.service';
import { OnlineStatutoryCertificateService } from './online-statutory-certificate.service';

@Injectable({ providedIn: 'root' })
export class StatutoryCertificateService extends BaseService {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineStatutoryCertificateProvider: OnlineStatutoryCertificateService,
    private offlineStatutoryCertificateProvider: OfflineStatutoryCertificateService) {
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
  getStatutoryCertificate(matricule: string): Promise<StatutoryCertificateModel> {
    return this.execFunctionService('getStatutoryCertificate', matricule);
  }
}
