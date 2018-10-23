import { OfflineStatutoryReportingProvider } from './offline-statutory-reporting';
import { OnlineStatutoryReportingProvider } from './online-statutory-reporting';
import { ConnectivityService } from './../../services/connectivity/connectivity.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base.provider';
import { StatutoryReporting } from '../../models/statutoryReporting/statutory-reporting';


@Injectable()
export class StatutoryReportingProvider extends BaseProvider {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineStatutoryReportingProvider: OnlineStatutoryReportingProvider,
    private offlineStatutoryReportingProvider: OfflineStatutoryReportingProvider) {
    super(
      connectivityService,
      onlineStatutoryReportingProvider,
      offlineStatutoryReportingProvider
    );
  }

  /**
   * Récupère le suivi réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
   * @return le suivi réglementaire du PNC
   */
  getStatutoryReporting(matricule: string): Promise<StatutoryReporting> {
    return this.execFunctionProvider('getStatutoryReporting', matricule);
  }

}
