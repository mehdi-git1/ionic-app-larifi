import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest/rest.base.service';
import { StatutoryCertificate } from '../../models/statutoryCertificate';

@Injectable()
export class OnlineStatutoryCertificateProvider {

  constructor(public restService: RestService,
    public config: Config) {
  }

  /**
   * Récupère l'attestation réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer l'attestation réglementaire
   * @return l'attestation réglementaire du PNC
   */
  getStatutoryCertificate(matricule: string): Promise<StatutoryCertificate> {
    return this.restService.get(`${this.config.backEndUrl}/statutory_certificate/${matricule}`);
  }
}
