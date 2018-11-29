import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { PncHomePage } from './modules/home/pages/pnc-home/pnc-home.page';
import { ImpersonatePage } from './modules/settings/pages/impersonate/impersonate.page';
import { AppInitService } from './core/services/app-init/app-init.service';
import { PinPadTypeEnum } from './core/enums/security/pin-pad-type.enum';
import { DeviceService } from './core/services/device/device.service';
import { GenericMessagePage } from './modules/home/pages/generic-message/generic-message.page';
import { OfflineSecurityService } from './core/services/security/offline-security.service';
import { AuthenticatedUserModel } from './core/models/authenticated-user.model';
import { AuthenticationPage } from './modules/home/pages/authentication/authentication.page';
import { SynchronizationService } from './core/services/synchronization/synchronization.service';
import { ToastService } from './core/services/toast/toast.service';
import { ConnectivityService } from './core/services/connectivity/connectivity.service';
import { SessionService } from './core/services/session/session.service';
import { SecurityServer } from './core/services/security/security.server';
import { SecMobilService } from './core/http/secMobil.service';
import { StorageService } from './core/storage/storage.service';
import { ModalSecurityService } from './core/services/modal/modal-security.service';


@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC implements OnInit {

  @ViewChild('content') nav: Nav;

  pinPadModalActive = false;
  switchToBackgroundDate: Date;
  pinPadShowupThresholdInSeconds = 120;
  pncSynchroThresholdInSeconds = 300;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private secMobilService: SecMobilService,
    private connectivityService: ConnectivityService,
    private events: Events,
    private securityModalService: ModalSecurityService,
    private sessionService: SessionService,
    public translateService: TranslateService,
    private storageService: StorageService,
    private deviceService: DeviceService,
    private appInitService: AppInitService,
    private toastProvider: ToastService,
    private securityProvider: SecurityServer,
    private synchronizationProvider: SynchronizationService,
    private offlineSecurityProvider: OfflineSecurityService,
    private app: App) {
    // A chaque changement de page, on récupère l'evenement pour la gestion du changement de tab
    app.viewWillEnter.subscribe(
      (data) => {
        this.events.publish('changeTab', data.component.name);
      }
    );
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
          if (moment.duration(moment().diff(moment(this.switchToBackgroundDate))).asSeconds() > this.pinPadShowupThresholdInSeconds) {
            this.securityModalService.forceCloseModal();
            this.securityModalService.displayPinPad(PinPadTypeEnum.openingApp);
          }
          if (this.connectivityService.isConnected() && moment.duration(moment().diff(moment(this.switchToBackgroundDate))).asSeconds() > this.pncSynchroThresholdInSeconds) {
            this.synchronizationProvider.storeEDossierOffline(this.sessionService.authenticatedUser.matricule);
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
          console.log(this.sessionService.getActiveUser());
          if (this.sessionService.getActiveUser().isPnc) {
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
  putAuthenticatedUserInSession(): Promise<AuthenticatedUserModel> {
    const promise = this.securityProvider.getAuthenticatedUser();
    promise.then(authenticatedUser => {
      if (authenticatedUser) {
        if (this.sessionService.impersonatedUser === null) {
          this.sessionService.authenticatedUser = authenticatedUser;
        } else {
          this.sessionService.impersonatedUser = authenticatedUser;
        }

        // Gestion de l'affichage du pinPad
        if (!this.deviceService.isBrowser() && !this.sessionService.impersonatedUser) {
          this.securityModalService.displayPinPad(PinPadTypeEnum.openingApp);
        }

        if (this.securityProvider.isAdmin(authenticatedUser) && !authenticatedUser.isPnc && !this.sessionService.impersonatedUser) {
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
   * Recupère le  user connecté en cache et redirige vers la PncModel Home PageModel.
   * Si il n'y est pas, on redirige vers une page d'erreur.
   */
  getAuthenticatedUserFromCache(): void {
    this.offlineSecurityProvider.getAuthenticatedUser().then(authenticatedUser => {
      this.sessionService.authenticatedUser = authenticatedUser;
      if (!this.deviceService.isBrowser()) {
        this.securityModalService.displayPinPad(PinPadTypeEnum.openingApp);
      }
      this.nav.setRoot(PncHomePage, { matricule: this.sessionService.getActiveUser().matricule });
    }, err => {
      this.nav.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') });
    });
  }
}
