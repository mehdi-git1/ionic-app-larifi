import { Injectable } from '@angular/core';

import { OfflineSecurityProvider } from './../security/offline-security';
import { OnlineSecurityProvider } from './../security/online-security';
import { ConnectivityService } from '../../services/connectivity/connectivity.service';
import { SessionService } from './../../services/session.service';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { BaseProvider } from '../base/base.provider';

import { AuthorizationService } from './../../services/authorization.service';
import { AppConstant } from './../../app/app.constant';

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
    if (this.sessionService.getActiveUser() === undefined) {
      return false;
    }
    return this.sessionService.getActiveUser().manager;
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

  /**
   * Teste si un utilisateur est admin de l'application
   * @param authenticatedUser l'utilisateur à tester
   * @return vrai si l'utilisateur est admin, faux sinon
   */
  isAdmin(authenticatedUser: AuthenticatedUser): boolean {
    if (authenticatedUser.profiles) {
      return authenticatedUser.profiles.indexOf(AppConstant.P_EDOSPNC_ADMIN) > -1;
    }
    return false;
  }

  /**
   * Vérifie si l'impersonnification est disponible pour un utilisateur donné
   * @param matricule le matricule de l'utilisateur
   * @return une promesse vide (le code de retour http détermine si l'impersonnification est possible ou non)
   */
  isImpersonationAvailable(matricule: string): Promise<void> {
    return this.connectivityService.isConnected() ?
      this.onlineSecurityProvider.isImpersonationAvailable(matricule) :
      new Promise((resolve, reject) => {
        reject();
      });
  }

}
