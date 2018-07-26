import { SynchronizationProvider } from './../providers/synchronization/synchronization';
import { ToastProvider } from './../providers/toast/toast';
import { ConnectivityService } from './../services/connectivity.service';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { ParametersProvider } from './../providers/parameters/parameters';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { SessionService } from './../services/session.service';
import { SecurityProvider } from './../providers/security/security';
import { PncHomePage } from './../pages/pnc-home/pnc-home';
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
    public translateService: TranslateService,
    private secMobilService: SecMobilService,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService,
    private storageService: StorageService,
    private connectivityService: ConnectivityService,
    private toastProvider: ToastProvider,
    private synchronizationProvider: SynchronizationProvider,
    public translate: TranslateService,
    private events: Events,
    private parametersProvider: ParametersProvider
  ) {
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      /**
       * Actuellement le ping est configuré pour être effectif sur le web et non sur le mobile
       * A terme, il faudra le remettre sur le mobile (probléme de CORS à l'eure actuelle)
       */

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translateService.setDefaultLang('fr');
      this.translateService.use('fr');

      this.secMobilService.init();
      this.secMobilService.isAuthenticated().then(() => {
        // launch process when already authenticated
        // Création du stockage local
        this.storageService.initOfflineMap().then(success => {
          this.putAuthenticatedUserInSession().then(authenticatedUser => {
            this.initParameters();
            this.synchronizationProvider.storeEDossierOffline(authenticatedUser.matricule).then(successStore => {
            }, error => {
            });

          });
        });

      },
        error => {
          console.log('go to authentication page');
          this.nav.setRoot(AuthenticationPage);
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
   * Récupère les parametres envoyé par le back
   */
  initParameters() {
    this.parametersProvider.getParams().then(parameters => {
      this.sessionService.parameters = parameters;
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
      console.log('putAuthenticatedUserInSession error: ' + JSON.stringify(error));
    });
    return promise;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
