import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Config } from './../../configuration/environment-variables/config';
import { HelpResource } from './../../models/helpResource';
/*
  Generated class for the HelpResourceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HelpResourceProvider {

  helpResourceUrl: string;

  constructor(public restService: RestService,
    private config: Config) {
    this.helpResourceUrl = `${config.backEndUrl}/helpResource`;
  }

  /**
   * Fait appel au service rest qui renvois la liste des ressources d'aide
   * @return la liste des objectifs
   */
  getHelpResourceList(typeProfil: String): Promise<HelpResource[]> {
    return this.restService.get(`${this.helpResourceUrl}/${typeProfil}`);
  }


}
