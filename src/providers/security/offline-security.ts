import { Entity } from './../../models/entity';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { StorageService } from './../../services/storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineSecurityProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Il ne peut y avoir qu'un seul utilisateur connecté, on purge donc la table avant de sauvegarder le nouveau
   */
  overwriteAuthenticatedUser(authenticatedUser: AuthenticatedUser) {
    this.storageService.deleteAll(Entity.AUTHENTICATED_USER);
    this.storageService.save(Entity.AUTHENTICATED_USER, authenticatedUser);
    this.storageService.persistOfflineMap();
  }

  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return new Promise((resolve, reject) => {
      const authenticatedUserList = this.storageService.findAll(Entity.AUTHENTICATED_USER);
      resolve(authenticatedUserList[Object.keys(authenticatedUserList)[0]]);
    });
  }

}
