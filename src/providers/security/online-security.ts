import { AuthenticatedUser } from './../../models/authenticatedUser';
import { OfflineSecurityProvider } from './../security/offline-security';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class OnlineSecurityProvider {
  private securityUrl: string;

  constructor(private restService: RestService,
    private offlineSecurityProvider: OfflineSecurityProvider,
    private config: Config) {
    this.securityUrl = `${config.backEndUrl}/me`;
  }

  /**
   * Fait appel au service rest qui renvois le user connecté.
   * @return les informations du pnc
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    const promise: Promise<AuthenticatedUser> = this.restService.get(`${this.securityUrl}`);
    promise.then(authenticatedUser => {
      this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUser().fromJSON(authenticatedUser));
    });
    return promise;
  }
}
