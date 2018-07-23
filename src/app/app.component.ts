import { AuthenticationPage } from './../pages/authentication/authentication';
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
    public authGuard: AuthGuard,
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

      if (this.secMobilService.isBrowser){
        this.connectivityService.pingAPI();
      }

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

      this.authGuard.guard().then(guardValue => {
        if (guardValue === false){
          this.nav.setRoot(AuthenticationPage);
        }else if (this.nav._elementRef.nativeElement.baseURI == 'http://localhost:8100/'){
          this.nav.setRoot('PncHomePage', { matricule: this.sessionService.authenticatedUser.matricule });
        }
      });
    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
