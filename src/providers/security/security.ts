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
  * @return cadre ou pas cadre
  */
  isManager(): boolean {
    if (this.sessionService.authenticatedUser === undefined) {
      return false;
    }
    return this.sessionService.authenticatedUser.manager;
  }

  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.connectivityService.isConnected() ?
      this.onlineSecurityProvider.getAuthenticatedUser() : this.offlineSecurityProvider.getAuthenticatedUser();
  }

}
