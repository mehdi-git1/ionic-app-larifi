import { SynchronizationProvider } from './../providers/synchronization/synchronization';
import { ToastProvider } from './../providers/toast/toast';
import { ConnectivityService } from './../services/connectivity.service';

import { SessionService } from './../services/session.service';
import { SecurityProvider } from './../providers/security/security';

import { Component, ViewChild, OnInit } from '@angular/core';

import { Nav, Platform, NavParams, NavController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';

import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { SecMobilService } from '../services/secMobil.service';
import { StorageService } from '../services/storage.service';
import { HomePage } from '../pages/home/home';
import { AuthGuard } from '../guard/auth.guard';

@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC implements OnInit {

  @ViewChild('content') nav: Nav;

  rootPage: any = HomePage;


  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    private secMobilService: SecMobilService,
    private authGuard: AuthGuard,
    private connectivityService: ConnectivityService,
    private toastProvider: ToastProvider,
    public translateService: TranslateService,
    private synchronizationProvider: SynchronizationProvider,
    private sessionService: SessionService
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


      // Détection d'un changement d'état de la connexion
      this.connectivityService.connectionStatusChange.subscribe(connected => {
        if (!connected) {
          this.toastProvider.warning(this.translateService.instant('GLOBAL.CONNECTIVITY.OFFLINE_MODE'));
        } else {
          this.toastProvider.success(this.translateService.instant('GLOBAL.CONNECTIVITY.ONLINE_MODE'));
          this.synchronizationProvider.synchronizeOfflineData();
        }
      });

      this.authGuard.guard(true).then(guardValue => {
        if (guardValue === false) {
          this.nav.setRoot('AuthenticationPage');
          /**
           * Ce test sert à définir si on est arrivé via la racine du site.
           * Si c'est le cas, on bascule vers la homePage.
           * Sinon, on ne fait rien et on est redirigé vers la page choisie
          */
        } else if (this.platform.getActiveElement().ownerDocument.location.hash === '' && this.sessionService.authenticatedUser) {
          this.nav.setRoot('PncHomePage', { matricule: this.sessionService.authenticatedUser.matricule });
        }
      });
    });
  }
}
