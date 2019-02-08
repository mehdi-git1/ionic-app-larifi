import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';
import { UrlConfiguration } from '../../configuration/url.configuration';

import { RestService } from '../../http/rest/rest.base.service';

@Injectable()
export class OnlineFormsInputParamService {

  constructor(
    public restService: RestService,
    public config: UrlConfiguration
  ) { }

  /**
   * Récupère une FormsInputParamsModel du cache à partir d'un matricule et le techId de la rotation
   * @param matricule le matricule du PNC concerné
   * @param rotationId le techId de la rotation concernée
   * @return une promesse contenant l'FormsInputParamsModel trouvée
   */
  getFormsInputParams(matricule, rotationId: number): Promise<FormsInputParamsModel> {
    return this.restService.get(this.config.getBackEndUrl('getFormsInputParams', [matricule, rotationId]));
  }
}
