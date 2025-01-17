import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { PncSynchroModel } from '../../models/pnc-synchro.model';

@Injectable({ providedIn: 'root' })
export class PncSynchroService {

  constructor(
    private restService: RestService,
    private config: UrlConfiguration
  ) { }

  /**
   * Récupère le EDossier complet d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer le EDossier
   * @return le EDossier complet du PNC
   */
  getPncSynchro(matricule: string): Promise<PncSynchroModel> {
    return this.restService.get(this.config.getBackEndUrl('getPncSynchroByPnc', [matricule]), undefined, undefined, false, true);
  }

  /**
   * Lance le processus de synchronisation du EDossier d'un PNC
   * @param pncSynchro le EDossier du PNC à synchroniser
   * @return le EDossier complet du PNC après synchro
   */
  synchronize(pncSynchro: PncSynchroModel): Promise<PncSynchroModel> {
    return this.restService.post(this.config.getBackEndUrl('pncSynchro'), pncSynchro);
  }

}
