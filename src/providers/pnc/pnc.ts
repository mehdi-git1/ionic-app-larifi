import { Pnc } from './../../models/pnc';
import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(public restService: RestService) {
    this.pncUrl = `${AppConfig.apiUrl}/pncs`;
  }

  /**
   * Fait appel au service rest qui renvois les informations.
   * @param matricule
   * @return les informations du pnc
   */
  getPnc(matricule: String): Promise<Pnc> {
    return this.restService.get(`${this.pncUrl}/${matricule}`);
  }
}
