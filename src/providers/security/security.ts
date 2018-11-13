import { AuthorizationService, AuthorizationService } from './../../services/authorization.service';
import { Injectable } from '@angular/core';

import { OfflineSecurityProvider } from './../security/offline-security';
import { OnlineSecurityProvider } from './../security/online-security';
import { ConnectivityService } from '../../services/connectivity/connectivity.service';
import { SessionService } from './../../services/session.service';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { BaseProvider } from '../base/base.provider';

@Injectable()
export class SecurityProvider extends BaseProvider {

  constructor(
    private sessionService: SessionService,
    protected connectivityService: ConnectivityService,
    protected authorizationService: AuthorizationService,
    private onlineSecurityProvider: OnlineSecurityProvider,
    private offlineSecurityProvider: OfflineSecurityProvider
  ) {
    super(
      connectivityService,
      onlineSecurityProvider,
      offlineSecurityProvider
    );
  }

  /**
  * vérifie si le pnc connecté est un cadre
  * @return true si le user connecté est un cadre, false sinon
  */
  isManager(): boolean {
    if (this.sessionService.authenticatedUser === undefined) {
      return false;
    }
    return this.sessionService.authenticatedUser.manager;
  }


  /**
  * Vérifie si le pnc a une permission
  * @param permission permission à vérifier
  * return true si le pnc n'est pas null ou undefined et si il a la permission, sinon false
  */
  hasPermissionToViewTab(permission: string): boolean {
    return this.authorizationService.hasPermission(permission);
  }

  /**
   * Récupère le user connecté à l'application
   * @return une promesse contenant le user connecté
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.execFunctionProvider('getAuthenticatedUser');
  }

  /**
   * Met à jour les données secrétes de l'utilisateur
   * @return une promesse contenant un void
   */
  setAuthenticatedSecurityValue(authenticatedUser: AuthenticatedUser): void | Promise<void> {
    return this.execFunctionProvider('setAuthenticatedSecurityValue', authenticatedUser);
  }

}
