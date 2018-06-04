import { FlightCrewListPage } from './../pages/flight-crew-list/flight-crew-list';
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
import { AuthenticationPage } from '../pages/authentication/authentication';
import { SecMobilService } from '../services/secMobil.service';

@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = PncHomePage;


  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public translate: TranslateService,
    private secMobilService: SecMobilService,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService,
    private events: Events
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translate.setDefaultLang('fr');
      this.translate.use('fr');

      this.platform.ready().then(() => {
        this.secMobilService.init();
        this.secMobilService.isAuthenticated().then(() => {
          // launch process when already authenticated
          // nothing to do there
        },
          error => {
            this.rootPage = AuthenticationPage;
          });
      });
      this.putAuthenticatedUserInSession();
    });
  }

  /**
  * Mettre le pnc connecté en session
  */
  putAuthenticatedUserInSession() {
    this.securityProvider.getAuthenticatedUser().then(authenticatedUser => {
      this.sessionService.authenticatedUser = authenticatedUser;
      this.events.publish('user:authenticated');
    }, error => { });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
