import { Config } from './../../configuration/environment-variables/config';
import { Parameters } from './../../models/Parameters';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest/rest.base.service';

@Injectable()
export class ParametersProvider {

  private parametersUrl: string;

  constructor(public restService: RestService,
    public config: Config) {
    this.parametersUrl = `${config.backEndUrl}/parameters`;
  }

  /**
  * Récupère les parametres envoyé depuis le back
  * @return la liste des parametres
  */
  getParams(): Promise<Parameters> {
    return this.restService.get(this.parametersUrl);
  }

}
