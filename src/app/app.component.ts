import { SynchronizationProvider } from './../providers/synchronization/synchronization';
import { ToastProvider } from './../providers/toast/toast';
import { ConnectivityService } from './../services/connectivity.service';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { SessionService } from './../services/session.service';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { SecurityProvider } from './../providers/security/security';
import { PncHomePage } from './../pages/pnc-home/pnc-home';
import { CareerObjectiveCreatePage } from './../pages/career-objective-create/career-objective-create';
import { Component, ViewChild } from '@angular/core';
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
export class EDossierPNC {
  @ViewChild('content') nav: Nav;

  rootPage: any = HomePage;


  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translateService: TranslateService,
    private secMobilService: SecMobilService,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService,
    private storageService: StorageService,
    private connectivityService: ConnectivityService,
    private toastProvider: ToastProvider,
    private synchronizationProvider: SynchronizationProvider,
    private events: Events
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translateService.setDefaultLang('fr');
      this.translateService.use('fr');

      this.platform.ready().then(() => {
        this.secMobilService.init();
        this.secMobilService.isAuthenticated().then(() => {
          // launch process when already authenticated
          // nothing to do there
          console.log('go to pnc home page');
          this.nav.setRoot(PncHomePage);
        }, error => {
          console.log('go to authentication page');
          this.nav.setRoot(AuthenticationPage);
        });
      });

      // Création du stockage local
      this.storageService.initOfflineMap().then(success => {
        this.putAuthenticatedUserInSession().then(authenticatedUser => {
          this.synchronizationProvider.storeEDossierOffline(authenticatedUser.username);
        });
      });

      // Détection d'un changement d'état de la connexion
      this.connectivityService.connectionStatusChange.subscribe(connected => {
        if (!connected) {
          this.toastProvider.warning(this.translateService.instant('GLOBAL.CONNECTIVITY.OFFLINE_MODE'));
        } else {
          this.toastProvider.success(this.translateService.instant('GLOBAL.CONNECTIVITY.ONLINE_MODE'));
          this.synchronizationProvider.synchronizeOfflineData();
        }
      });

    });
  }

  /**
  * Mettre le pnc connecté en session
  */
  putAuthenticatedUserInSession(): Promise<AuthenticatedUser> {
    const promise = this.securityProvider.getAuthenticatedUser();
    promise.then(authenticatedUser => {
      this.sessionService.authenticatedUser = authenticatedUser;
      this.events.publish('user:authenticated');
    }, error => { });
    return promise;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
