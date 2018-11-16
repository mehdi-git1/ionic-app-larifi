import { Injectable } from '@angular/core';

import { Config } from '../../../../configuration/environment-variables/config';
import { PncPin } from '../../models/pncPin';
import { DeviceService } from '../../../../services/device.service';
import { AuthenticatedUser } from '../../models/authenticatedUser';
import { OfflineSecurityProvider } from './offline-security';
import { RestService } from '../../../../services/rest/rest.base.service';

@Injectable()
export class OnlineSecurityProvider {

  constructor(
    private restService: RestService,
    private offlineSecurityProvider: OfflineSecurityProvider,
    private config: Config,
    private deviceService: DeviceService
  ) { }

  /**
   * Fait appel au service rest qui renvois le user connecté.
   * @return les informations du pnc
   */
  getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.restService.get(this.config.getBackEndUrl('getSecurityInfos')).then(authenticatedUser => {
      // Pour le mobile, on récupére les informations secretes (code PIN, question / réponse secréte)
      // avant de mettre l'utilisateur en session
      if (!this.deviceService.isBrowser()) {
        return this.restService.get(this.config.getBackEndUrl('getSecretInfosByMatricule', [authenticatedUser.matricule])).then(data => {
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
    return this.restService.put(this.config.getBackEndUrl('secretInfos'), authenticatedUser.pinInfo).then(data => {
      this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUser().fromJSON(authenticatedUser));
    });
  }

  /**
   * Vérifie si l'impersonnification est disponible pour un utilisateur donné
   * @param matricule le matricule de l'utilisateur
   * @return une promesse vide (le code de retour http détermine si l'impersonnification est possible ou non)
   */
  isImpersonationAvailable(matricule: string): Promise<void> {
    return this.restService.get(this.config.getBackEndUrl('getImpersonationAvailableByMatricule', [matricule]));
  }
}
