import { Injectable } from '@angular/core';
import { Config } from '../../configuration/environment-variables/config';

@Injectable()
export class SummarySheetProvider {

  constructor(private config: Config) { }

  /**
    * Renvoi le lien pour la fiche synthese d'un PNC
    * @param matricule le PNC concerné
    * @return le lien
    */
  getLink(matricule: string) {
    return `${this.config.backEndUrl}/pnc_summary_sheets/${matricule}`;
  }
}

