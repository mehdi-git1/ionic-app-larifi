import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { UserPermission } from '../../models/admin/user-permission.model';

@Injectable()
export class UserPermissionService {

  constructor(private restService: RestService,
    private config: UrlConfiguration) {
  }

  /**
  * Récupère la liste des permissions de l'application
  *
  * @return la lise des permissions de l'application
  */
  public getAllUserPermission(): Promise<UserPermission[]> {
    return this.restService.get(this.config.getBackEndUrl('userPermissions'));
  }
}
