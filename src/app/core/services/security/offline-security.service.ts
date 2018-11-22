import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class OfflineSecurityService {

  constructor(private storageService: StorageService) {
  }

  /**
   * Ecrase l'utilisateur connecté stocké en cache.
   * Il ne peut y avoir qu'un seul utilisateur connecté, on purge donc la table avant de sauvegarder le nouveau
   * @param authenticatedUser le user connecté
   */
  overwriteAuthenticatedUser(authenticatedUser: AuthenticatedUserModel) {
    this.storageService.deleteAll(EntityEnum.AUTHENTICATED_USER);
    this.storageService.save(EntityEnum.AUTHENTICATED_USER, authenticatedUser);
    this.storageService.persistOfflineMap();
  }

  /**
   * Récupère le user connecté du cache
   * @return une promesse contenant le user connecté
   */
  getAuthenticatedUser(): Promise<AuthenticatedUserModel> {
    return new Promise((resolve, reject) => {
      const authenticatedUserList = this.storageService.findAll(EntityEnum.AUTHENTICATED_USER);
      if (authenticatedUserList.length > 0) {
        resolve(authenticatedUserList[Object.keys(authenticatedUserList)[0]]);
      }
      reject();
    });
  }

  /**
   * Met à jour des informations de securité de l'utilisateur
   * @param  authenticatedUser le user à mettre à jour
   * @return rien n'est attendu en retour
   */
  setAuthenticatedSecurityValue(authenticatedUser: AuthenticatedUserModel): void {
      this.overwriteAuthenticatedUser(new AuthenticatedUserModel().fromJSON(authenticatedUser));
  }

}
