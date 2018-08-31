import { PncPin } from './../../models/pncPin';
import { DeviceService } from './../../services/device.service';
import { SecMobilService } from './../../services/secMobil.service';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { OfflineSecurityProvider } from './../security/offline-security';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class OnlineSecurityProvider {
  private securityUrl: string;
  private secretInfosUrl: string;

  constructor(
    private restService: RestService,
    private offlineSecurityProvider: OfflineSecurityProvider,
    private config: Config,
    private deviceService: DeviceService
  ) {
    this.securityUrl = `${config.backEndUrl}/me`;
    this.secretInfosUrl = `${config.backEndUrl}/pin`;
  }

  /**
   * Fait appel au service rest qui renvois le user connecté.
   * @return les informations du pnc
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.restService.get(`${this.securityUrl}`).then(authenticatedUser => {
      // Pour le mobile, on récupére les informations secretes (code PIN, question / réponse secréte)
      // avant de mettre l'utilisateur en session
      if (!this.deviceService.isBrowser()) {
        return this.restService.get(`${this.secretInfosUrl}/${authenticatedUser.matricule}`).then( data => {
          authenticatedUser.pinInfo = new PncPin;
          authenticatedUser.pinInfo.matricule = data.matricule;
          authenticatedUser.pinInfo.pinCode = data.pinCode;
          authenticatedUser.pinInfo.secretQuestion = data.secretQuestion;
          authenticatedUser.pinInfo.secretAnswer = data.secretAnswer;
          this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUser().fromJSON(authenticatedUser));
          return authenticatedUser;
        }, error => {
          authenticatedUser.pinInfo = new PncPin;
          this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUser().fromJSON(authenticatedUser));
          return authenticatedUser;
        });
      } else {
        authenticatedUser.pinInfo = new PncPin;
        this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUser().fromJSON(authenticatedUser));
        return authenticatedUser;
      }
    });
  }

    /**
   * Met à jour des informations de securité de l'utilisateur
   * @param  pinValues l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  setAuthenticatedSecurityValue(authenticatedUser: AuthenticatedUser): Promise<void> {
    return this.restService.put(this.secretInfosUrl, authenticatedUser.pinInfo).then( data => {
      this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUser().fromJSON(authenticatedUser));
    });
  }
}
