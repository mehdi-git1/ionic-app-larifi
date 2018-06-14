import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Config } from './../../configuration/environment-variables/config';
import { HelpAsset } from './../../models/helpAsset';

@Injectable()
export class HelpAssetProvider {

  HelpAssetUrl: string;

  constructor(public restService: RestService,
    private config: Config) {
    this.HelpAssetUrl = `${config.backEndUrl}/helpAsset`;
  }

  /**
   * Fait appel au service rest qui renvois la liste des ressources d'aide
   * @return la liste des ressources d'aides (description, nom, url)
   */
  getHelpAssetList(typeProfil: String): Promise<HelpAsset[]> {
    return this.restService.get(`${this.HelpAssetUrl}/${typeProfil}`);
  }


}
