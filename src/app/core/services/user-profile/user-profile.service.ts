import { Config } from './../../../../environments/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UserProfile } from '../../models/admin/user-profile.model';
import { UserPermission } from '../../models/admin/user-permission.model';
import { UrlConfiguration } from '../../configuration/url.configuration';

@Injectable()
export class UserProfileService {

  constructor(private restService: RestService,
    private config: UrlConfiguration) {
  }

  /**
   * Récupère la liste des profils habile de l'application
   * @return la liste des profils habile
   */
  public getAllUserProfile(): Promise<UserProfile[]> {
    return this.restService.get(this.config.getBackEndUrl('userProfiles'));
  }

  /**
   * Récupère la liste des permissions du profil en paramètre
   * @param name le libellé du profil dont on souhaite récupérer les permissions
   * @return la liste des permissions du profil en paramètre
   */
  public getUserPermissionsByUserProfile(name: string): Promise<UserPermission[]> {
    return this.restService.get(this.config.getBackEndUrl('userPermissionsByUserProfile', [name]));

  }
}
