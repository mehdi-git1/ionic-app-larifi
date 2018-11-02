import { PncSynchro } from './../../models/pncSynchro';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest/rest.base.service';

@Injectable()
export class PncSynchroProvider {

  private pncSynchroUrl: string;

  constructor(private restService: RestService,
    private config: Config) {
    this.pncSynchroUrl = `${config.backEndUrl}/pnc_synchros`;
  }

  /**
   * Récupère le EDossier complet d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer le EDossier
   * @return le EDossier complet du PNC
   */
  getPncSynchro(matricule: string): Promise<PncSynchro> {
    return this.restService.get(`${this.pncSynchroUrl}/${matricule}`);
  }

  /**
   * Lance le processus de synchronisation du EDossier d'un PNC
   * @param pncSynchro le EDossier du PNC à synchroniser
   * @return le EDossier complet du PNC après synchro
   */
  synchronize(pncSynchro: PncSynchro): Promise<PncSynchro> {
    return this.restService.post(this.pncSynchroUrl, pncSynchro);
  }

}
