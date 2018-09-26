import { SummarySheetTransformerProvider } from './summary-sheet-transformer';
import { OfflineProvider } from './../offline/offline';
import { OfflineSummarySheetProvider } from './offline-summary-sheet';
import { ConnectivityService } from './../../services/connectivity.service';
import { Injectable } from '@angular/core';
import { OnlineSummarySheetProvider } from './online-summary-sheet';
import { SummarySheet } from '../../models/summarySheet';
import { Utils } from '../../common/utils';
import { BaseProvider } from '../base.provider';

@Injectable()
export class SummarySheetProvider extends BaseProvider {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineSummarySheetProvider: OnlineSummarySheetProvider,
    private offlineSummarySheetProvider: OfflineSummarySheetProvider,
    private offlineProvider: OfflineProvider
  ){
    super(
      connectivityService,
      onlineSummarySheetProvider,
      offlineSummarySheetProvider
    );
  }

  /**
    * Renvoi la fiche synthese d'un PNC
    * @param matricule le PNC concerné
    * @return la fiche synthese d'un PNC
    */
  getSummarySheet(matricule: string): Promise<SummarySheet> {
    return this.execFunctionProvider('getSummarySheet', matricule);
  }
}
