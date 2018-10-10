import { AppConstant } from './../../app/app.constant';
import { OfflineSecurityProvider } from './../security/offline-security';
import { OnlineSecurityProvider } from './../security/online-security';
import { ConnectivityService } from './../../services/connectivity.service';
import { SessionService } from './../../services/session.service';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { Injectable } from '@angular/core';

@Injectable()
export class SecurityProvider {

  constructor(
    private sessionService: SessionService,
    private connectivityService: ConnectivityService,
    private onlineSecurityProvider: OnlineSecurityProvider,
    private offlineSecurityProvider: OfflineSecurityProvider) {
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
   * Récupère le user connecté à l'application
   * @return une promesse contenant le user connecté
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.connectivityService.isConnected() ?
      this.onlineSecurityProvider.getAuthenticatedUser() :
      this.offlineSecurityProvider.getAuthenticatedUser();
  }

  /**
   * Met à jour les données secrétes de l'utilisateur
   * @return une promesse contenant un void
   */
  setAuthenticatedSecurityValue(authenticatedUser: AuthenticatedUser): void | Promise<void> {
    return this.connectivityService.isConnected() ?
      this.onlineSecurityProvider.setAuthenticatedSecurityValue(authenticatedUser) :
      this.offlineSecurityProvider.setAuthenticatedSecurityValue(authenticatedUser);
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
   * Vérifie si l'impersonnification est disponible pour le user mis en session (dans impersonatedUser)
   * @return une promesse vide (le code de retour http détermine si l'impersonnification est possible ou non)
   */
  isImpersonationAvailable(): Promise<void> {
    return this.connectivityService.isConnected() ?
      this.onlineSecurityProvider.isImpersonationAvailable() :
      new Promise((resolve, reject) => {
        reject();
      });
  }

}
