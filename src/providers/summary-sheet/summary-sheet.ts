import { SummarySheetTransformerProvider } from './summary-sheet-transformer';
import { OfflineProvider } from './../offline/offline';
import { OfflineSummarySheetProvider } from './offline-summary-sheet';
import { ConnectivityService } from './../../services/connectivity.service';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../configuration/environment-variables/config';
import { RestService } from '../../services/rest.base.service';
import { OnlineSummarySheetProvider } from './online-summary-sheet';
import { SummarySheet } from '../../models/summarySheet';

@Injectable()
export class SummarySheetProvider {

  constructor(private config: Config,
    private restService: RestService,
    private connectivityService: ConnectivityService,
    private onlineSummarySheetProvider: OnlineSummarySheetProvider,
    private offlineSummarySheetProvider: OfflineSummarySheetProvider,
    private offlineProvider: OfflineProvider,
    private summarySheetTransformerProvider: SummarySheetTransformerProvider) { }

  /**
    * Renvoi la fiche synthese d'un PNC
    * @param matricule le PNC concerné
    * @return la fiche synthese d'un PNC
    */
  getSummarySheet(matricule: string): Promise<SummarySheet> {
    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.offlineSummarySheetProvider.getSummarySheet(matricule).then(offlineSummarySheet => {
          this.onlineSummarySheetProvider.getSummarySheet(matricule).then(onlineSummarySheet => {
            const onlineData = this.summarySheetTransformerProvider.toSummarySheet(onlineSummarySheet, matricule);
            this.offlineProvider.flagDataAvailableOffline(onlineData, offlineSummarySheet);
            resolve(onlineData);
          });
        });
      });
    } else {
      return this.offlineSummarySheetProvider.getSummarySheet(matricule);
    }
  }
}
