import { Injectable } from '@angular/core';

import { Config } from '../../../../configuration/environment-variables/config';
import { PncRole } from '../../models/pncRole';
import { RestService } from '../../../../services/rest/rest.base.service';
import { HelpAsset } from '../../models/helpAsset';

@Injectable()
export class HelpAssetProvider {

  constructor(
    public restService: RestService,
    private config: Config
  ) { }

  /**
   * Fait appel au service REST qui renvois la liste des ressources d'aide
   * @param pncRole Le role du PNC pour lequel on souhaite les ressources
   * @return La liste des ressources d'aides (description, nom, url)
   */
  getHelpAssetList(pncRole: PncRole): Promise<HelpAsset[]> {
    return this.restService.get(this.config.getBackEndUrl('getHelpAssetsByRoleId', [pncRole]));
  }


}
