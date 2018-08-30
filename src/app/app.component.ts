import { DeviceService } from './../services/device.service';
import { GenericMessagePage } from './../pages/generic-message/generic-message';
import { OfflineSecurityProvider } from './../providers/security/offline-security';
import { PncHomePage } from './../pages/pnc-home/pnc-home';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { ParametersProvider } from './../providers/parameters/parameters';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { SynchronizationProvider } from './../providers/synchronization/synchronization';
import { ToastProvider } from './../providers/toast/toast';
import { ConnectivityService } from './../services/connectivity.service';

import { SessionService } from './../services/session.service';
import { SecurityProvider } from './../providers/security/security';

import { Component, ViewChild, OnInit } from '@angular/core';

import { Nav, Platform, Events } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';

import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { SecMobilService } from '../services/secMobil.service';
import { StorageService } from '../services/storage.service';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC implements OnInit {

  @ViewChild('content') nav: Nav;

  rootPage: any = HomePage;


  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private secMobilService: SecMobilService,
    private connectivityService: ConnectivityService,
    private events: Events,
    private sessionService: SessionService,
    public translateService: TranslateService,
    private storageService: StorageService,
    private deviceService: DeviceService,
    private toastProvider: ToastProvider,
    private parametersProvider: ParametersProvider,
    private securityProvider: SecurityProvider,
    private synchronizationProvider: SynchronizationProvider,
    private offlineSecurityProvider: OfflineSecurityProvider) {
    }

    ngOnInit(): void {
      this.initializeApp();
    }
    
    initializeApp() {
      
      this.platform.ready().then(() => {
        if (this.deviceService.isBrowser) {
          this.splashScreen.hide();
        }
        
      this.statusBar.styleDefault();

      this.translateService.setDefaultLang('fr');
      this.translateService.use('fr');

      this.secMobilService.init();
      this.secMobilService.isAuthenticated().then(() => {
        // Création du stockage local
        this.storageService.initOfflineMap().then(success => {

          this.putAuthenticatedUserInSession().then(authenticatedUser => {
            this.initParameters();
            if (this.deviceService.isOfflineModeAvailable()) {
              this.synchronizationProvider.synchronizeOfflineData();
              this.synchronizationProvider.storeEDossierOffline(authenticatedUser.matricule).then(successStore => {
                this.events.publish('EDossierOffline:stored');
                this.splashScreen.hide();
              }, error => {
                this.splashScreen.hide();
              });
            }

          }, error => {
            this.splashScreen.hide();
          });

        });
      }, error => {
        this.nav.setRoot(AuthenticationPage);
        this.splashScreen.hide();
      });

      this.events.subscribe('connectionStatus:disconnected', () => {
        this.connectivityService.startPingAPI();
      });

      // Détection d'un changement d'état de la connexion
      this.connectivityService.connectionStatusChange.subscribe(connected => {
        if (!connected) {
          this.toastProvider.warning(this.translateService.instant('GLOBAL.CONNECTIVITY.OFFLINE_MODE'));
        } else {
          this.toastProvider.success(this.translateService.instant('GLOBAL.CONNECTIVITY.ONLINE_MODE'));
          this.initParameters();
          this.synchronizationProvider.synchronizeOfflineData();
          this.synchronizationProvider.storeEDossierOffline(this.sessionService.authenticatedUser.matricule).then(successStore => {
            this.events.publish('EDossierOffline:stored');
          }, error => {
          });
        }
      });
    });
  }

  /**
     * Récupère les parametres envoyé par le back
     */
  initParameters() {
    this.parametersProvider.getParams().then(parameters => {
      this.sessionService.parameters = parameters;
      this.events.publish('parameters:ready');
    }, error => { });
  }

  /**
  * Mettre le pnc connecté en session
  */
  putAuthenticatedUserInSession(): Promise<AuthenticatedUser> {
    const promise = this.securityProvider.getAuthenticatedUser();
    promise.then(authenticatedUser => {
      if (authenticatedUser) {
        this.sessionService.authenticatedUser = authenticatedUser;
        this.nav.setRoot(PncHomePage, { matricule: this.sessionService.authenticatedUser.matricule });
      }
      else {
        this.nav.setRoot(AuthenticationPage);
      }
    }, error => {
      this.connectivityService.setConnected(false);
      this.offlineSecurityProvider.getAuthenticatedUser().then(authenticatedUser => {
        this.sessionService.authenticatedUser = authenticatedUser;
        this.nav.setRoot(PncHomePage, { matricule: this.sessionService.authenticatedUser.matricule });
      }, err => {
        this.nav.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') });
      });
    });
    return promise;
  }

}
