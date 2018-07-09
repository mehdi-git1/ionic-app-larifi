import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../configuration/environment-variables/config';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class SummarySheetProvider {

  constructor(private config: Config, private restService: RestService) { }

  /**
    * Renvoi la fiche synthese d'un PNC
    * @param matricule le PNC concerné
    * @return la fiche synthese d'un PNC
    */
  getSummarySheet(matricule: string): Promise<Blob> {
    return this.restService.get(`${this.config.backEndUrl}/pnc_summary_sheets/${matricule}`, null, { responseType: 'blob' });
  }
}

