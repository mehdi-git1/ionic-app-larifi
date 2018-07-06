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
    private sessionService: SessionService,
    private events: Events
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
      // this.secMobilService.secMobilRevokeCertificate().then(s => {
      this.secMobilService.isAuthenticated().then(() => {
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
      console.log('putAuthenticatedUserInSession : ' + authenticatedUser);
      this.sessionService.authenticatedUser = authenticatedUser;
      this.nav.setRoot(PncHomePage);
      this.events.publish('user:authenticated');
    }, error => {
      console.log('putAuthenticatedUserInSession error: ' + error);
      // this.nav.setRoot(AuthenticationPage);
    });
  }
}
