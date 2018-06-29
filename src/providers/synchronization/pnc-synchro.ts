import { PncSynchro } from './../../models/pncSynchro';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class PncSynchroProvider {

  private pncSynchroUrl: string;

  constructor(private restService: RestService,
    private config: Config) {
    this.pncSynchroUrl = `${config.backEndUrl}/pnc_synchros`;
  }

  getPncSynchro(matricule: string): Promise<PncSynchro> {
    return this.restService.get(`${this.pncSynchroUrl}/${matricule}`);
  }

  synchronize(pncSynchro: PncSynchro): Promise<PncSynchro> {
    return this.restService.post(this.pncSynchroUrl, pncSynchro);
  }

}
