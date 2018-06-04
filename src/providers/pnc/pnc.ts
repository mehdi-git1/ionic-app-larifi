import { Config } from './../../configuration/environment-variables/config';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(public restService: RestService,
    public config: Config) {
    this.pncUrl = `${config.backEndUrl}/pncs`;
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
