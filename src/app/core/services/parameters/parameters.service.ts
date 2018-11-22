import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { ParametersModel } from '../../models/parameters.model';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable()
export class ParametersService {

  constructor(
    public restService: RestService,
    public config: UrlConfiguration
  ) { }

  /**
  * Récupère les parametres envoyé depuis le back
  * @return la liste des parametres
  */
  getParams(): Promise<ParametersModel> {
    return this.restService.get(this.config.getBackEndUrl('getParameters'));
  }

}
