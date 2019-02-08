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
  public getAllUserProfiles(): Promise<UserProfile[]> {
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

  /**
   * Ajoute une liste de permissions au profil
   * @param profileName le nom du profil
   * @param userPermissionResourceList la liste de permission
   * @return le profil mis à jout
   */
  public updatePermissions(profileName: string, userPermissionList: UserPermission[]): Promise<UserProfile> {
    return this.restService.put(this.config.getBackEndUrl('addPermissions', [profileName]), userPermissionList);
  }
}
