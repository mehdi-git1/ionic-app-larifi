import { ImpersonatePage } from './../pages/impersonate/impersonate';
import { AppInitService } from './../services/appInit.service';
import { PinPadType } from './../models/pinPadType';
import { DeviceService } from './../services/device.service';
import { GenericMessagePage } from './../pages/generic-message/generic-message';
import { OfflineSecurityProvider } from './../providers/security/offline-security';
import { PncHomePage } from './../pages/pnc-home/pnc-home';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { SynchronizationProvider } from './../providers/synchronization/synchronization';
import { ToastProvider } from './../providers/toast/toast';
import { ConnectivityService } from './../services/connectivity.service';

import { SessionService } from './../services/session.service';
import { SecurityProvider } from './../providers/security/security';

import { Component, ViewChild, OnInit } from '@angular/core';

import { Nav, Platform, Events, ModalController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';

import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { SecMobilService } from '../services/secMobil.service';
import { StorageService } from '../services/storage.service';
import { HomePage } from '../pages/home/home';

import { SecurityModalService } from './../services/security.modal.service';

import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC implements OnInit {

  @ViewChild('content') nav: Nav;

  rootPage: any = HomePage;

  pinPadModalActive = false;
  switchToBackgroundDate: Date;
  inactivityDelayInSec = 120;


  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private secMobilService: SecMobilService,
    private connectivityService: ConnectivityService,
    private events: Events,
    private securityModalService: SecurityModalService,
    private sessionService: SessionService,
    public translateService: TranslateService,
    private storageService: StorageService,
    private deviceService: DeviceService,
    private appInitService: AppInitService,
    private toastProvider: ToastProvider,
    private securityProvider: SecurityProvider,
    private synchronizationProvider: SynchronizationProvider,
    private offlineSecurityProvider: OfflineSecurityProvider) {
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {

      if (!this.deviceService.isBrowser()) {
        /**
        * On ajoute une écoute sur un paramétre pour savoir si la popin est activée ou pas pour afficher un blur
        * et une interdiction de cliquer avant d'avoir mis le bon code pin
        */
        this.securityModalService.modalDisplayed.subscribe(data => {
          this.pinPadModalActive = data;
        });

        this.platform.resume.subscribe(() => {
          // Si on a depassé le temps d'inactivité, on affiche le pin pad
          if (moment.duration(moment().diff(moment(this.switchToBackgroundDate))).asSeconds() > this.inactivityDelayInSec && !this.deviceService.isBrowser()) {
            this.securityModalService.forceCloseModal();
            this.securityModalService.displayPinPad(PinPadType.openingApp);
          }
        });

        /** On ajoute un evenement pour savoir si on entre en mode background */
        this.platform.pause.subscribe(() => {
          this.switchToBackgroundDate = new Date();
        });
      }

      this.statusBar.styleDefault();

      this.translateService.setDefaultLang('fr');
      this.translateService.use('fr');

      this.secMobilService.init();
      this.secMobilService.isAuthenticated().then(() => {
        // Création du stockage local
        this.storageService.initOfflineMap().then(success => {
          this.connectivityService.pingAPI().then(
            pingSuccess => {
              this.connectivityService.setConnected(true);
              this.events.publish('user:authenticated');
            }, pingError => {
              if (this.deviceService.isOfflineModeAvailable()) {
                this.connectivityService.setConnected(false);
                this.connectivityService.startPingAPI();
                this.getAuthenticatedUserFromCache();
              } else if (this.deviceService.isBrowser()) {
                this.nav.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE') });
              }
            });
        });
      }, error => {
        this.nav.setRoot(AuthenticationPage);
        this.splashScreen.hide();
      });


      // Détection d'un changement d'état de la connexion
      this.connectivityService.connectionStatusChange.subscribe(connected => {
        if (!connected) {
          this.toastProvider.warning(this.translateService.instant('GLOBAL.CONNECTIVITY.OFFLINE_MODE'));
        } else {
          this.toastProvider.success(this.translateService.instant('GLOBAL.CONNECTIVITY.ONLINE_MODE'));
          this.initUserData();
        }
      });

      this.events.subscribe('connectionStatus:disconnected', () => {
        this.connectivityService.startPingAPI();
      });

      // Déclenchement d'une authentification
      this.events.subscribe('user:authenticated', () => {
        this.putAuthenticatedUserInSession().then(authenticatedUser => {
          if (this.sessionService.getActiveUser().pnc) {
            this.initUserData();
          }
          this.events.publish('user:authenticationDone');
        });
      });

    });
  }

  /**
   * Initialise les données de l'utilisateur connecté (ses filtres, son cache etc)
   */
  initUserData(): void {
    this.appInitService.initParameters();
    if (this.deviceService.isOfflineModeAvailable()) {
      this.synchronizationProvider.synchronizeOfflineData();
      this.synchronizationProvider.storeEDossierOffline(this.sessionService.getActiveUser().matricule).then(successStore => {
        this.events.publish('EDossierOffline:stored');
      }, error => {
      });
    }
  }

  /**
  * Mettre le pnc connecté en session
  */
  putAuthenticatedUserInSession(): Promise<AuthenticatedUser> {
    const promise = this.securityProvider.getAuthenticatedUser();
    promise.then(authenticatedUser => {
      if (authenticatedUser) {
        if (this.sessionService.impersonatedUser === null) {
          this.sessionService.authenticatedUser = authenticatedUser;
        } else {
          this.sessionService.impersonatedUser = authenticatedUser;
        }

        // Gestion de l'affichage du pinPad
        if (!this.deviceService.isBrowser()) {
          this.securityModalService.displayPinPad(PinPadType.openingApp);
        }

        if (this.securityProvider.isAdmin(authenticatedUser) && !authenticatedUser.pnc && !this.sessionService.impersonatedUser) {
          this.nav.setRoot(ImpersonatePage);
        }
        else {
          this.nav.setRoot(PncHomePage, { matricule: this.sessionService.getActiveUser().matricule });
        }
      }
      else {
        this.nav.setRoot(AuthenticationPage);
      }
    }, error => {
      this.connectivityService.setConnected(false);
      this.getAuthenticatedUserFromCache();
    });
    return promise;
  }

  /**
   * Recupère le  user connecté en cache et redirige vers la Pnc Home Page.
   * Si il n'y est pas, on redirige vers une page d'erreur.
   */
  getAuthenticatedUserFromCache(): void {
    this.offlineSecurityProvider.getAuthenticatedUser().then(authenticatedUser => {
      this.sessionService.authenticatedUser = authenticatedUser;
      if (!this.deviceService.isBrowser()) {
        this.securityModalService.displayPinPad(PinPadType.openingApp);
      }
      this.nav.setRoot(PncHomePage, { matricule: this.sessionService.getActiveUser().matricule });
    }, err => {
      this.nav.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') });
    });
  }
}
