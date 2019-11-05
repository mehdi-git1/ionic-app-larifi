import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { AuthenticatedUserModel } from '../../../../core/models/authenticated-user.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
  selector: 'page-impersonate',
  templateUrl: 'impersonate.page.html',
  styleUrls: ['./impersonate.page.scss']
})
export class ImpersonatePage {

  selectedPnc: PncModel;
  impersonatingInProgress = false;

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private events: Events,
    public sessionService: SessionService,
    public authenticationService: AuthenticationService
  ) {
  }

  /**
   * Lance le processus permettant de se faire passer pour un PNC
   * @param pnc Le pnc qu'on souhaite impersonnifier
   */
  impersonateUser(pnc: PncModel): void {
    this.impersonatingInProgress = true;
    this.securityService.isImpersonationAvailable(pnc.matricule).then(success => {
      const impersonatedUser = new AuthenticatedUserModel();
      impersonatedUser.matricule = pnc.matricule;
      this.sessionService.impersonatedUser = impersonatedUser;
      // On fait la redirection aprés avoir récupéré le user impersonnifié
      this.authenticationService.putAuthenticatedUserInSession().then(
        data => {
          this.sessionService.visitedPnc = undefined;
          this.events.publish('user:authenticationDone');

          this.goToHomePage();
        }
      );
      this.impersonatingInProgress = false;
    }, error => {
      this.impersonatingInProgress = false;
    });
  }

  /**
   * Vérifie si l'utilisateur connecté peut récupérer son identité d'origine
   * @return vrai si c'est le cas, faux sinon
   */
  canGetMyIdentityBack(): boolean {
    return this.sessionService.impersonatedUser !== null && this.sessionService.authenticatedUser.isPnc;
  }

  /**
   * Enclenche la récupération de l'identité d'origine de l'utilisateur connecté en supprimant le PNC impersonnifié
   */
  getMyIdentityBack(): void {
    this.sessionService.impersonatedUser = null;
    this.goToHomePage();
    this.authenticationService.putAuthenticatedUserInSession().then(
      data => this.events.publish('user:authenticationDone')
    );
  }

  /**
   * Vérifie que l'utilisateur impersonnifié est complet, afin d'éviter d'afficher des infos incomplètes
   * @return vrai si les infos sont complètes, faux sinon
   */
  isImpersonatedUserComplete() {
    const impersonatedUser = this.sessionService.impersonatedUser;
    return impersonatedUser && impersonatedUser.matricule && impersonatedUser.firstName && impersonatedUser.lastName;
  }

  /**
   * Redirige vers la page d'accueil
   */
  goToHomePage() {
    if (this.sessionService.getActiveUser().isManager) {
      this.router.navigate(['tabs', 'home']);
    } else {
      this.router.navigate(['career-objective']);
    }
  }
}
