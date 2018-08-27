import { SummarySheetTransformerProvider } from './summary-sheet-transformer';
import { OfflineProvider } from './../offline/offline';
import { OfflineSummarySheetProvider } from './offline-summary-sheet';
import { ConnectivityService } from './../../services/connectivity.service';
import { Injectable } from '@angular/core';
import { OnlineSummarySheetProvider } from './online-summary-sheet';
import { SummarySheet } from '../../models/summarySheet';
import { Utils } from '../../common/utils';

@Injectable()
export class SummarySheetProvider {

  constructor(private connectivityService: ConnectivityService,
    private onlineSummarySheetProvider: OnlineSummarySheetProvider,
    private offlineSummarySheetProvider: OfflineSummarySheetProvider,
    private offlineProvider: OfflineProvider,
    private summarySheetTransformerProvider: SummarySheetTransformerProvider) {
  }

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
            try {
              if (!onlineSummarySheet || !onlineSummarySheet.summarySheet) {
                resolve(null);
              }
              const file = new Blob([Utils.base64ToArrayBuffer(onlineSummarySheet.summarySheet)], { type: 'application/pdf' });
              const onlineData = this.summarySheetTransformerProvider.toSummarySheetFromBlob(file, matricule);
              const offlineData = this.summarySheetTransformerProvider.toSummarySheet(offlineSummarySheet);
              this.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
              resolve(onlineData);
            } catch (error) {
              console.log('getSummarySheet error : ' + error);
            }
          },
            error => {
              console.log(' error onlineSummarySheetProvider ' + error);
            });
        },
          error => {
            console.log(' error offlineSummarySheetProvider ' + error);
          });
      });
    } else {
      return this.offlineSummarySheetProvider.getSummarySheet(matricule);
    }
  }
}
