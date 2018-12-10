import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { SummarySheetTransformerService } from './summary-sheet-transformer.service';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable()
export class OnlineSummarySheetService {

  constructor(
    public restService: RestService,
    public config: UrlConfiguration,
    public summarySheetTransformerProvider: SummarySheetTransformerService
  ) { }

  /**
   * Récupère la fiche synthese d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer la fiche synthese
   * @return la fiche synthese du PNC
   */
  getSummarySheet(matricule: string): Promise<any> {
    return this.restService.get(this.config.getBackEndUrl('getSummarySheetByMatricule', [matricule])).then(
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
