import { AuthenticationPage } from './../pages/authentication/authentication';
import { SessionService } from './../services/session.service';
import { SecurityProvider } from './../providers/security/security';
import { PncHomePage } from './../pages/pnc-home/pnc-home';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { SecMobilService } from '../services/secMobil.service';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC implements OnInit {

  @ViewChild('content') nav: Nav;

  rootPage: any = HomePage;

  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public translate: TranslateService,
    private secMobilService: SecMobilService,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService
  ) {
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translate.setDefaultLang('fr');
      this.translate.use('fr');

      this.secMobilService.init();
      this.secMobilService.isAuthenticated().then(() => {
        // launch process when already authenticated
        this.putAuthenticatedUserInSession();
      },
        error => {
          console.log('go to authentication page');
          this.nav.setRoot(AuthenticationPage);
        });
    });
    // });
  }

  /**
  * Mettre le pnc connecté en session
  */
  putAuthenticatedUserInSession() {
    console.log('putAuthenticatedUserInSession');
    this.securityProvider.getAuthenticatedUser().then(authenticatedUser => {
      if (authenticatedUser) {
        console.log('go to pnc home page ' + JSON.stringify(authenticatedUser));
        this.sessionService.authenticatedUser = authenticatedUser;
        this.nav.setRoot(PncHomePage, {matricule: this.sessionService.authenticatedUser.matricule});
      }
      else{
        this.nav.setRoot(AuthenticationPage);
      }
    }, error => {
      console.log('putAuthenticatedUserInSession error: ' + JSON.stringify(error));
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
