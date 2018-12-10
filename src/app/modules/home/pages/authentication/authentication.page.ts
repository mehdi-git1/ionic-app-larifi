import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { SecMobilService } from '../../../../core/http/secMobil.service';
import { StorageService } from '../../../../core/storage/storage.service';
import { PncHomePage } from '../pnc-home/pnc-home.page';
import { DeviceService } from '../../../../core/services/device/device.service';
import { ModalSecurityService } from '../../../../core/services/modal/modal-security.service';
import { PinPadTypeEnum } from '../../../../core/enums/security/pin-pad-type.enum';
import { SynchronizationService } from '../../../../core/services/synchronization/synchronization.service';
import { AuthenticatedUserModel } from '../../../../core/models/authenticated-user.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { SecurityServer } from '../../../../core/services/security/security.server';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.page.html',
})
export class AuthenticationPage {

  loginForm: FormGroup;
  errorMsg: string;
  hideSpinner = true;

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private securityProvider: SecurityServer,
    private sessionService: SessionService,
    private storageService: StorageService,
    private secMobilService: SecMobilService,
    public translateService: TranslateService,
    public deviceService: DeviceService,
    public securityModalService: ModalSecurityService,
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

  sendAuthent() {
    if (this.hideSpinner === true) {
      this.hideSpinner = false;
      this.errorMsg = null;

      const loginValue: string = this.loginForm.value['login'];
      const passwordValue: string = this.loginForm.value['password'];

      this.secMobilService.authenticate(loginValue, passwordValue).then(x => {
        this.storageService.initOfflineMap().then(success => {
          this.putAuthenticatedUserInSession().then(authenticatedUser => {
            this.events.publish('user:logged');
            this.events.publish('user:authenticationDone');
          }, error => {
            this.secMobilService.secMobilRevokeCertificate();
            if (error === 'secmobil.incorrect.credentials') {
              this.errorMsg = this.translateService.instant('GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS');
            } else {
              this.errorMsg = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');
            }
            this.hideSpinner = true;
          }).catch(
            exception => {
              this.errorMsg = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');
              this.hideSpinner = true;
            }
          );
        });
      }).catch(
        exception => {
          this.errorMsg = this.translateService.instant('GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS');
          this.hideSpinner = true;
        }
      );
    }
  }

  putAuthenticatedUserInSession(): Promise<AuthenticatedUserModel> {
    this.hideSpinner = false;
    const promise = this.securityProvider.getAuthenticatedUser();
    promise.then(authenticatedUser => {
      if (authenticatedUser) {
        this.sessionService.authenticatedUser = authenticatedUser;
        // Gestion de l'affchage du pinPad
        if (!this.deviceService.isBrowser()) {
          this.securityModalService.displayPinPad(PinPadTypeEnum.openingApp);
        }
        this.navCtrl.setRoot(PncHomePage, { matricule: this.sessionService.authenticatedUser.matricule });
      }
      this.hideSpinner = true;
    }, error => {
      this.hideSpinner = true;
    });
    return promise;
  }

}
