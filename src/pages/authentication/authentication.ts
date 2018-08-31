import { SessionService } from './../../services/session.service';
import { SecurityProvider } from './../../providers/security/security';
import { PncHomePage } from './../pnc-home/pnc-home';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { App, NavController, IonicPage } from 'ionic-angular';
import { SecMobilService } from '../../services/secMobil.service';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

import { DeviceService } from '../../services/device.service';
import { SecurityModalService } from '../../services/security.modal.service';
import { PinPadType } from '../../models/pinPadType';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
})
export class AuthenticationPage implements OnInit {

  loginForm: FormGroup;
  errorMsg: string;
  hideSpinner = true;

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService,
    private secMobilService: SecMobilService,
    public translateService: TranslateService,
    public deviceService: DeviceService,
    public securityModalService: SecurityModalService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.hideSpinner = false;
    this.secMobilService.isAuthenticated().then(() => {
      this.hideSpinner = true;
      this.putAuthenticatedUserInSession();
    },
      error => {
        this.hideSpinner = true;
      });
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
        this.putAuthenticatedUserInSession();
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
    }
  }

  putAuthenticatedUserInSession() {
    this.hideSpinner = false;
    this.securityProvider.getAuthenticatedUser().then(authenticatedUser => {
      this.sessionService.authenticatedUser = authenticatedUser;
      // Gestion de l'affichage du pinPad
      if (!this.deviceService.isBrowser()) {
        this.securityModalService.displayPinPad(PinPadType.openingApp);
      }
      this.navCtrl.setRoot(PncHomePage, { matricule: authenticatedUser.matricule });
      this.hideSpinner = true;
    }, error => {
      this.hideSpinner = true;
    });
  }

}
