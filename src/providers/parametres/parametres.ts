import { Config } from './../../configuration/environment-variables/config';
import { Parameters } from './../../models/Parameters';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class ParametresProvider {

  private parametersUrl: string;

  constructor(public restService: RestService,
    public config: Config) {
    this.parametersUrl = `${config.backEndUrl}/parameters`;
  }

  /**
  * Récupère les parametres du filtre de recherche des pnc
  * @return la liste des parametres
  */
  getPncFilterParams(): Promise<Parameters[]> {
    return this.restService.get(`${this.parametersUrl}/pnc-filter`);
  }

}
