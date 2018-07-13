import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class OnlineSummarySheetProvider {
  private pncUrl: string;

  constructor(public restService: RestService,
    public config: Config) {
  }

  /**
   * Récupère
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @return les informations du PNC
   */
  getSummarySheet(matricule: string): Promise<Blob> {
    return this.restService.get(`${this.config.backEndUrl}/pnc_summary_sheets/${matricule}`, null, { responseType: 'blob' });
  }
}
