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
    private config: Config) {
    this.securityUrl = `${config.backEndUrl}/me`;
  }

  /**
   * Fait appel au service rest qui renvois le user connecté.
   * @return les informations du pnc
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.restService.get(`${this.securityUrl}`);
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
