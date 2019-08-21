import { Events, NavController } from 'ionic-angular';

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { AuthenticatedUserModel } from '../../../../core/models/authenticated-user.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    CareerObjectiveListPage
} from '../../../development-program/pages/career-objective-list/career-objective-list.page';
import { PncHomePage } from '../../../home/pages/pnc-home/pnc-home.page';

@Component({
  selector: 'page-impersonate',
  templateUrl: 'impersonate.page.html',
})
export class ImpersonatePage {

  selectedPnc: PncModel;
  impersonatingInProgress = false;

  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private pncProvider: PncService,
    private securityProvider: SecurityService,
    private events: Events,
    public sessionService: SessionService,
    public authenticationService: AuthenticationService
  ) {
  }

  /**
  * Redirige vers la page d'accueil
  * @param pnc le pnc sélectionné
  */
  openPncHomePage(pnc: PncModel) {
    this.navCtrl.push(PncHomePage, { matricule: pnc.matricule });
  }

  /**
   * Lance le processus permettant de se faire passer pour un PNC
   * @param pnc Le pnc qu'on souhaite impersonnifier
   */
  impersonateUser(pnc: PncModel): void {
    this.impersonatingInProgress = true;
    this.securityProvider.isImpersonationAvailable(pnc.matricule).then(success => {
      const impersonatedUser = new AuthenticatedUserModel();
      impersonatedUser.matricule = pnc.matricule;
      this.sessionService.impersonatedUser = impersonatedUser;
      // On fait la redirection aprés avoir récupéré le user impersonnifié
      this.authenticationService.putAuthenticatedUserInSession().then(
        data => {
          this.sessionService.visitedPnc = undefined;
          this.events.publish('user:authenticationDone');
          // On redirige vers la page PncHomePage pour permettre le rechargement de celle-ci
          // le popToRoot ne recharge pas la page en rafraichissant les données
          if (this.navCtrl.parent) {
            this.navCtrl.setRoot(this.sessionService.getActiveUser().isManager ? PncHomePage : CareerObjectiveListPage);
          } else {
            this.navCtrl.popToRoot();
          }
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
    if (this.navCtrl.parent) {
      this.navCtrl.setRoot(this.sessionService.getActiveUser().isManager ? PncHomePage : CareerObjectiveListPage, { matricule: this.sessionService.getActiveUser().matricule });
    }
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
}
