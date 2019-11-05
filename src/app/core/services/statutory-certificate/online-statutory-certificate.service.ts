import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { StatutoryCertificateModel } from '../../models/statutory.certificate.model';

@Injectable({ providedIn: 'root' })
export class OnlineStatutoryCertificateService {

  constructor(
    public restService: RestService,
    public config: UrlConfiguration
  ) { }

  /**
   * Récupère l'attestation réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer l'attestation réglementaire
   * @return l'attestation réglementaire du PNC
   */
  getStatutoryCertificate(matricule: string): Promise<StatutoryCertificateModel> {
    return this.restService.get(this.config.getBackEndUrl('getStatutoryCertificateByMatricule', [matricule]));
  }
}
