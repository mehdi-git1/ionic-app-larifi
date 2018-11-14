import { Injectable } from '@angular/core';

import { Config } from './../../configuration/environment-variables/config';
import { Parameters } from './../../models/Parameters';
import { RestService } from '../../services/rest/rest.base.service';

@Injectable()
export class ParametersProvider {

  constructor(
    public restService: RestService,
    public config: Config
  ) { }

  /**
  * Récupère les parametres envoyé depuis le back
  * @return la liste des parametres
  */
  getParams(): Promise<Parameters> {
    return this.restService.get(this.config.getBackEndUrl('getParameters'));
  }

}
