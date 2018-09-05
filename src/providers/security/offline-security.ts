import { Entity } from './../../models/entity';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { StorageService } from './../../services/storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineSecurityProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Ecrase l'utilisateur connecté stocké en cache.
   * Il ne peut y avoir qu'un seul utilisateur connecté, on purge donc la table avant de sauvegarder le nouveau
   * @param authenticatedUser le user connecté
   */
  overwriteAuthenticatedUser(authenticatedUser: AuthenticatedUser) {
    this.storageService.deleteAll(Entity.AUTHENTICATED_USER);
    this.storageService.save(Entity.AUTHENTICATED_USER, authenticatedUser);
    this.storageService.persistOfflineMap();
  }

  /**
   * Récupère le user connecté du cache
   * @return une promesse contenant le user connecté
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return new Promise((resolve, reject) => {
      const authenticatedUserList = this.storageService.findAll(Entity.AUTHENTICATED_USER);
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
  setAuthenticatedSecurityValue(authenticatedUser: AuthenticatedUser): void {
      this.overwriteAuthenticatedUser(new AuthenticatedUser().fromJSON(authenticatedUser));
  }

}
