import { Entity } from './../../models/entity';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { EDossierPncObject } from '../../models/eDossierPncObject';

@Injectable()
export class OfflineAuthenticatedUserProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Il ne peut y avoir qu'un seul utilisateur connecté, on purge donc la table avant de sauvegarder le nouveau
   */
  saveTheOne(authenticatedUser: AuthenticatedUser) {
    this.storageService.deleteAll(Entity.AUTHENTICATED_USER);
    this.storageService.save(Entity.AUTHENTICATED_USER, authenticatedUser);
  }

  findTheOne() {
    const authenticatedUserList = this.storageService.findAll(Entity.AUTHENTICATED_USER);
    return authenticatedUserList[Object.keys(authenticatedUserList)[0]];
  }

}
