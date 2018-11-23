import { Injectable } from '@angular/core';

import { OfflineSummarySheetService } from './offline-summary-sheet.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OnlineSummarySheetService } from './online-summary-sheet.service';
import { SummarySheetModel } from '../../models/summary.sheet.model';
import { BaseService } from '../base/base.service';

@Injectable()
export class SummarySheetService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineSummarySheetProvider: OnlineSummarySheetService,
    private offlineSummarySheetProvider: OfflineSummarySheetService
  ) {
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
  getSummarySheet(matricule: string): Promise<SummarySheetModel> {
    return this.execFunctionProvider('getSummarySheet', matricule);
  }
}
