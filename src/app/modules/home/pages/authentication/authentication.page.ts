import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { AuthenticationStatusEnum } from '../../../../core/enums/authentication-status.enum';
import { DeviceService } from '../../../../core/services/device/device.service';
import { ModalSecurityService } from '../../../../core/services/modal/modal-security.service';
import { AppInitService } from '../../../../core/services/routing/app-init.service';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.page.html',
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage {

  loginForm: FormGroup;
  errorMsg: string;
  hideSpinner = true;

  constructor(
    private formBuilder: FormBuilder,
    public translateService: TranslateService,
    public deviceService: DeviceService,
    public securityModalService: ModalSecurityService,
    private authenticationService: AuthenticationService,
    private appInitService: AppInitService
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
            this.appInitService.handleAuthenticationStatus(authentReturn);
          }
        });
    }
  }


}
