import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { PncHomePage } from '../pnc-home/pnc-home.page';
import { DeviceService } from '../../../../core/services/device/device.service';
import { ModalSecurityService } from '../../../../core/services/modal/modal-security.service';
import { PinPadTypeEnum } from '../../../../core/enums/security/pin-pad-type.enum';
import { SessionService } from './../../../../core/services/session/session.service';
import { AuthenticationService } from './../../../../core/authentication/authentication.service';
import { AuthenticationStatusEnum } from '../../../../core/enums/authentication-status.enum';
import { GenericMessagePage } from '../generic-message/generic-message.page';
@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.page.html',
})
export class AuthenticationPage {

  loginForm: FormGroup;
  errorMsg: string;
  hideSpinner = true;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public translateService: TranslateService,
    public deviceService: DeviceService,
    public securityModalService: ModalSecurityService,
    private authenticationService: AuthenticationService,
    private sessionService: SessionService,
    private nav: NavController,
    private events: Events
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  /**
   * Permet de se connecter
   */
  sendAuthent() {
    if (this.hideSpinner === true) {
      this.hideSpinner = false;
      this.errorMsg = null;

      const loginValue: string = this.loginForm.value['login'];
      const passwordValue: string = this.loginForm.value['password'];

      this.authenticationService.authenticateUser(loginValue, passwordValue).then(
        authentReturn => {
          this.routingAuthent(authentReturn);
        });
    }
  }

  /**
 * Gestion du routing en fonction du paramétre d'entrée
 * @param authentReturn retour de l'authentification
 */
  routingAuthent(authentReturn: AuthenticationStatusEnum) {
    if (authentReturn === AuthenticationStatusEnum.AUTHENTICATION_OK) {
      this.events.publish('user:authenticationDone');
      if (!this.deviceService.isBrowser() && !this.sessionService.impersonatedUser) {
        this.securityModalService.displayPinPad(PinPadTypeEnum.openingApp);
      }
      this.nav.setRoot(PncHomePage, { matricule: this.sessionService.getActiveUser().matricule });
    } else if (authentReturn === AuthenticationStatusEnum.INIT_KO) {
      this.nav.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') });
    } else if (authentReturn === AuthenticationStatusEnum.APPLI_UNAVAILABLE) {
      this.nav.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE') });
    } else if (authentReturn === AuthenticationStatusEnum.AUTHENTICATION_KO) {
      this.errorMsg = this.translateService.instant('GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS');
      this.hideSpinner = true;
    }
  }
}
