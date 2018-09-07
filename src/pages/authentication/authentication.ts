import { StorageService } from './../../services/storage.service';
import { PncHomePage } from './../pnc-home/pnc-home';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { App, NavController, IonicPage, Events } from 'ionic-angular';
import { SecMobilService } from '../../services/secMobil.service';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

import { DeviceService } from '../../services/device.service';
import { SecurityModalService } from '../../services/security.modal.service';
import { PinPadType } from '../../models/pinPadType';
import { SynchronizationProvider } from '../../providers/synchronization/synchronization';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { AppInitService } from './../../services/appInit.service';
import { SessionService } from './../../services/session.service';
import { SecurityProvider } from './../../providers/security/security';

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
    private storageService: StorageService,
    private secMobilService: SecMobilService,
    public translateService: TranslateService,
    public deviceService: DeviceService,
    public securityModalService: SecurityModalService,
    private synchronizationProvider: SynchronizationProvider,
    private events: Events,
    private appInitService: AppInitService
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
        this.storageService.initOfflineMap().then(success => {
          this.putAuthenticatedUserInSession().then(authenticatedUser => {
            this.appInitService.initParameters();
            if (this.deviceService.isOfflineModeAvailable()) {
              this.synchronizationProvider.synchronizeOfflineData();
              this.synchronizationProvider.storeEDossierOffline(authenticatedUser.matricule).then(successStore => {
                this.events.publish('EDossierOffline:stored');
                this.hideSpinner = true;
              }, error => {
                this.hideSpinner = true;
              });
            }
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
      });
    }
  }

  putAuthenticatedUserInSession(): Promise<AuthenticatedUser> {
    this.hideSpinner = false;
    const promise = this.securityProvider.getAuthenticatedUser();
    promise.then(authenticatedUser => {
      if (authenticatedUser) {
        this.sessionService.authenticatedUser = authenticatedUser;
        // Gestion de l'affchage du pinPad
        if (!this.deviceService.isBrowser()) {
          this.securityModalService.displayPinPad(PinPadType.openingApp);
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
