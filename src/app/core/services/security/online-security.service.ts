import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { PncPinModel } from '../../models/pnc-pin.model';
import { DeviceService } from '../device/device.service';
import { OfflineSecurityService } from './offline-security.service';

@Injectable({ providedIn: 'root' })
export class OnlineSecurityService {

  constructor(
    private restService: RestService,
    private offlineSecurityProvider: OfflineSecurityService,
    private config: UrlConfiguration,
    private deviceService: DeviceService
  ) { }

  /**
   * Fait appel au service rest qui renvois le user connecté.
   * @return les informations du pnc
   */
  getAuthenticatedUser(): Promise<AuthenticatedUserModel> {
    return this.restService.get(this.config.getBackEndUrl('getSecurityInfos')).then(authenticatedUser => {
      // Pour le mobile, on récupére les informations secretes (code PIN, question / réponse secréte)
      // avant de mettre l'utilisateur en session
      if (!this.deviceService.isBrowser()) {
        return this.restService.get(this.config.getBackEndUrl('getSecretInfosByMatricule', [authenticatedUser.matricule])).then(data => {
          authenticatedUser.pinInfo = new PncPinModel();
          authenticatedUser.pinInfo.matricule = data.matricule;
          authenticatedUser.pinInfo.pinCode = data.pinCode;
          authenticatedUser.pinInfo.secretQuestion = data.secretQuestion;
          authenticatedUser.pinInfo.secretAnswer = data.secretAnswer;
          this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUserModel().fromJSON(authenticatedUser));
          return authenticatedUser;
        }, error => {
          authenticatedUser.pinInfo = new PncPinModel();
          this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUserModel().fromJSON(authenticatedUser));
          return authenticatedUser;
        });
      } else {
        authenticatedUser.pinInfo = new PncPinModel();
        this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUserModel().fromJSON(authenticatedUser));
        return authenticatedUser;
      }
    });
  }

  /**
   * Met à jour des informations de securité de l'utilisateur
   * @param  pinValues l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  setAuthenticatedSecurityValue(authenticatedUser: AuthenticatedUserModel): Promise<void> {
    return this.restService.put(this.config.getBackEndUrl('secretInfos'), authenticatedUser.pinInfo).then(data => {
      this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUserModel().fromJSON(authenticatedUser));
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
