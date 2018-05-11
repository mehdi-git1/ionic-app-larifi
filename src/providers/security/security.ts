import { AuthenticatedUser } from './../../models/authenticatedUser';
import { Pnc } from './../../models/pnc';
import { SessionService } from './../../services/session.service';
import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class SecurityProvider {

  private securityUrl: string;

  constructor(public restService: RestService,
    private sessionService: SessionService) {
    this.securityUrl = `${AppConfig.apiUrl}/me`;
  }

  /**
   * Fait appel au service rest qui renvois le user connecté.
   * @return les informations du pnc
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.restService.get(`${this.securityUrl}`);
  }

  /**
   * test si le pnc connecté est un cadre
   */
  isManager(): boolean {
    return this.sessionService.authenticatedUser.manager;
  }

}
