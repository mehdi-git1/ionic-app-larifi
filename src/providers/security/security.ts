import { OfflineAuthenticatedUserProvider } from './../offline-authenticated-user/offline-authenticated-user';
import { ConnectivityService } from './../../services/connectivity.service';
import { Config } from './../../configuration/environment-variables/config';
import { SessionService } from './../../services/session.service';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class SecurityProvider {

  private securityUrl: string;

  constructor(public restService: RestService,
    private sessionService: SessionService,
    private connectivityService: ConnectivityService,
    private offlineAuthenticatedUserProvider: OfflineAuthenticatedUserProvider,
    private config: Config) {
    this.securityUrl = `${config.backEndUrl}/me`;
  }

  /**
   * Fait appel au service rest qui renvois le user connecté.
   * @return les informations du pnc
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    if (this.connectivityService.isConnected()) {
      const promise: Promise<AuthenticatedUser> = this.restService.get(`${this.securityUrl}`);
      promise.then(authenticatedUser => {
        this.offlineAuthenticatedUserProvider.saveTheOne(new AuthenticatedUser().fromJSON(authenticatedUser));
      });
      return promise;
    } else {
      return this.offlineAuthenticatedUserProvider.findTheOne();
    }

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

}
