import { PncRole } from './../../models/pncRole';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Config } from './../../configuration/environment-variables/config';
import { HelpAsset } from './../../models/helpAsset';

@Injectable()
export class HelpAssetProvider {

  helpAssetUrl: string;

  constructor(public restService: RestService,
    private config: Config) {
    this.helpAssetUrl = `${config.backEndUrl}/helpAsset`;
  }

  /**
   * Fait appel au service REST qui renvois la liste des ressources d'aide
   * @param pncRole Donner le role du PNC pour lequel on souhaite les ressources
   * @return la liste des ressources d'aides (description, nom, url)
   */
  getHelpAssetList(pncRole: PncRole): Promise<HelpAsset[]> {
    return this.restService.get(`${this.helpAssetUrl}/${pncRole}`);
  }


}
