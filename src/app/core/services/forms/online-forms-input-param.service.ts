import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';
import { UrlConfiguration } from '../../configuration/url.configuration';

import { RestService } from '../../http/rest/rest.base.service';
import { RotationModel } from '../../models/rotation.model';

@Injectable()
export class OnlineFormsInputParamService {

  constructor(
    public restService: RestService,
    public config: UrlConfiguration
  ) { }

  /**
   * Récupère une FormsInputParamsModel à partir d'un matricule et d'une rotation
   * @param matricule le matricule du PNC concerné
   * @param rotation la rotation concernée
   * @return une promesse contenant le FormsInputParamsModel trouvée
   */
  getFormsInputParams(matricule, rotation: RotationModel): Promise<FormsInputParamsModel> {
    return this.restService.get(this.config.getBackEndUrl('getFormsInputParams', [matricule, rotation.number, rotation.departureDate]));
  }
}
