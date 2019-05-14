import { Injectable } from '@angular/core';

import { OfflineSecurityService } from './offline-security.service';
import { OnlineSecurityService } from './online-security.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { SessionService } from '../session/session.service';
import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { BaseService } from '../base/base.service';

import { AuthorizationService } from '../authorization/authorization.service';
import { AppConstant } from '../../../app.constant';

@Injectable()
export class SecurityService extends BaseService {

  constructor(
    private sessionService: SessionService,
    protected connectivityService: ConnectivityService,
    protected authorizationService: AuthorizationService,
    private onlineSecurityService: OnlineSecurityService,
    private offlineSecurityService: OfflineSecurityService
  ) {
    super(
      connectivityService,
      onlineSecurityService,
      offlineSecurityService
    );
  }

  /**
  * vérifie si le pnc connecté est un cadre
  * @return true si le user connecté est un cadre, false sinon
  */
  isManager(): boolean {
    if (this.sessionService.getActiveUser() === undefined) {
      return false;
    }
    return this.sessionService.getActiveUser().isManager;
  }


  /**
  * Vérifie si le pnc a une permission
  * @param permission permission à vérifier
  * @return true si le pnc a la permission, sinon false
  */
  hasPermissionToViewTab(permission: string): boolean {
    return this.authorizationService.hasPermission(permission);
  }

  /**
   * Récupère le user connecté à l'application
   * @return une promesse contenant le user connecté
   */
  getAuthenticatedUser(): Promise<AuthenticatedUserModel> {
    return this.execFunctionService('getAuthenticatedUser');
  }

  /**
   * Met à jour les données secrétes de l'utilisateur
   * @return une promesse contenant un void
   */
  setAuthenticatedSecurityValue(authenticatedUser: AuthenticatedUserModel): void | Promise<void> {
    return this.execFunctionService('setAuthenticatedSecurityValue', authenticatedUser);
  }

  /**
   * Teste si un utilisateur est admin de l'application
   * @param authenticatedUser l'utilisateur à tester
   * @return vrai si l'utilisateur est admin, faux sinon
   */
  isAdmin(authenticatedUser: AuthenticatedUserModel): boolean {
    if (authenticatedUser.profiles) {
      return authenticatedUser.profiles.indexOf(AppConstant.P_EDOSPNC_ADMIN) > -1;
    }
    return false;
  }

  /**
   * Vérifie si l'impersonnification est disponible pour un utilisateur donné
   * @param matricule le matricule de l'utilisateur
   * @return une promesse vide (le code de retour http détermine si l'impersonnification est possible ou non)
   */
  isImpersonationAvailable(matricule: string): Promise<void> {
    return this.connectivityService.isConnected() ?
      this.onlineSecurityService.isImpersonationAvailable(matricule) :
      new Promise((resolve, reject) => {
        reject();
      });
  }

  /**
   * Vérifie si le mode admin est disponible pour les bilans professionnels
   * @return vrai si le mode admin est disponible, faux sinon
   */
  isProfessionalInterviewAdmin(): boolean {
    return (this.authorizationService.hasPermission('PROFESSIONAL_INTERVIEW_FULL_EDITION')
      || this.sessionService.getActiveUser().isRdd
      || this.sessionService.getActiveUser().isRds
      || this.sessionService.getActiveUser().isBaseProvinceManager);
  }

}
