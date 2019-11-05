import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { UserPermissionModel } from '../../models/admin/user-permission.model';
import { UserProfileModel } from '../../models/admin/user-profile.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {

  constructor(
    private restService: RestService,
    private config: UrlConfiguration) {
  }

  /**
   * Récupère la liste des profils habile de l'application
   * @return la liste des profils habile
   */
  public getAllUserProfiles(): Promise<UserProfileModel[]> {
    return this.restService.get(this.config.getBackEndUrl('userProfiles'));
  }

  /**
   * Récupère la liste des permissions du profil en paramètre
   * @param name le libellé du profil dont on souhaite récupérer les permissions
   * @return la liste des permissions du profil en paramètre
   */
  public getUserPermissionsByUserProfile(name: string): Promise<UserPermissionModel[]> {
    return this.restService.get(this.config.getBackEndUrl('userPermissionsByUserProfile', [name]));

  }

  /**
   * Met à jour un profil avec une nouvelle liste de permissions
   * @param profileName le nom du profil
   * @param userPermissionList la liste de permission
   * @return le profil mis à jour
   */
  public updatePermissions(profileName: string, userPermissionList: UserPermissionModel[]): Promise<UserProfileModel> {
    return this.restService.put(this.config.getBackEndUrl('updatePermissions', [profileName]), userPermissionList);
  }
}
