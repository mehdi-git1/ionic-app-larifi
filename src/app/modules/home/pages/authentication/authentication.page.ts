import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { DeviceService } from '../../../../core/services/device/device.service';
import { ModalSecurityService } from '../../../../core/services/modal/modal-security.service';
import { AuthenticationService } from './../../../../core/authentication/authentication.service';
import { RoutingService } from '../../../../core/routing/routing.service';
import { AuthenticationStatusEnum } from '../../../../core/enums/authentication-status.enum';
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
    private routingService: RoutingService
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
    if (this.hideSpinner) {
      this.hideSpinner = false;
      this.errorMsg = null;

      const loginValue: string = this.loginForm.value['login'];
      const passwordValue: string = this.loginForm.value['password'];

      this.authenticationService.authenticateUser(loginValue, passwordValue).then(
        authentReturn => {
          this.hideSpinner = true;
          if (authentReturn === AuthenticationStatusEnum.AUTHENTICATION_KO) {
            this.errorMsg = this.translateService.instant('GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS');
          } else {
            this.routingService.handleAuthenticationStatus(authentReturn, this.navCtrl);
          }
        });
    }
  }


}
