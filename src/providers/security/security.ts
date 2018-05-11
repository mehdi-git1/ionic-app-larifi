import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class SecurityProvider {

  private securityUrl: string;

  constructor(public restService: RestService) {
    this.securityUrl = `${AppConfig.apiUrl}/me`;
  }

  /**
   * Fait appel au service rest qui renvois le user connecté.
   * @param matricule
   * @return les informations du pnc
   */
  getconnectedPnc(matricule: String): Promise<any> {
    return this.restService.get(`${this.securityUrl}`);
  }

}
