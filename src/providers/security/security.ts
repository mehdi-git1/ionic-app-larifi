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
    if (this.sessionService.authenticatedUser === undefined) {
      return false;
    }
    return this.sessionService.authenticatedUser.manager;
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
   * Récupère le user connecté à l'application
   * @return une promesse contenant le user connecté
   */
  setAuthenticatedSecurityValue(authenticatedUser: AuthenticatedUser) {
    return this.connectivityService.isConnected() ?
      this.onlineSecurityProvider.setAuthenticatedSecurityValue(authenticatedUser) :
      this.offlineSecurityProvider.setAuthenticatedSecurityValue(authenticatedUser) ;
  }



}
