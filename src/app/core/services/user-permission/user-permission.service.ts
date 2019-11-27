import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { UserPermissionModel } from '../../models/admin/user-permission.model';

@Injectable({ providedIn: 'root' })
export class UserPermissionService {

  constructor(
    private restService: RestService,
    private config: UrlConfiguration) {
  }

  /**
   * Récupère la liste des permissions de l'application
   *
   * @return la lise des permissions de l'application
   */
  public getAllUserPermission(): Promise<UserPermissionModel[]> {
    return this.restService.get(this.config.getBackEndUrl('userPermissions'));
  }
}
