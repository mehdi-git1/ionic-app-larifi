import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { PncRoleEnum } from '../../enums/pnc-role.enum';
import { RestService } from '../../http/rest/rest.base.service';
import { HelpAssetModel } from '../../models/help-asset.model';

@Injectable()
export class HelpAssetService {

  constructor(
    public restService: RestService,
    private config: UrlConfiguration
  ) { }

  /**
   * Fait appel au service REST qui renvois la liste des ressources d'aide
   * @param pncRole Le role du PNC pour lequel on souhaite les ressources
   * @return La liste des ressources d'aides (description, nom, url)
   */
  getHelpAssetList(pncRole: PncRoleEnum): Promise<HelpAssetModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getHelpAssetsByRoleId', [pncRole]));
  }


}
