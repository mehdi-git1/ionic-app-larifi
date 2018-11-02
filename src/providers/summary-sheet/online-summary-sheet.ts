import { SummarySheetTransformerProvider } from './summary-sheet-transformer';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest/rest.base.service';

@Injectable()
export class OnlineSummarySheetProvider {
  private pncUrl: string;

  constructor(
    public restService: RestService,
    public config: Config,
    public summarySheetTransformerProvider: SummarySheetTransformerProvider
  ) {
  }

  /**
   * Récupère la fiche synthese d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer la fiche synthese
   * @return la fiche synthese du PNC
   */
  getSummarySheet(matricule: string): Promise<any> {
    return this.restService.get(`${this.config.backEndUrl}/pnc_summary_sheets/${matricule}`).then(
      onlineSummarySheet => {
        try {
          if (!onlineSummarySheet || !onlineSummarySheet.summarySheet) {
            return (null);
          }
          const onlineData = this.summarySheetTransformerProvider.toSummarySheetFromBlob(onlineSummarySheet.summarySheet, matricule);
          return (onlineData);
        } catch (error) { }
      });
  }
}
