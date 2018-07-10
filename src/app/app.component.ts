import { ParametresProvider } from './../providers/parametres/parametres';
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
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC {
  @ViewChild('content') nav: Nav;

  rootPage: any = HomePage;


  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public translate: TranslateService,
    private secMobilService: SecMobilService,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService,
    private events: Events,
    private parametresProvider: ParametresProvider
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
          console.log('go to pnc home page');
          this.nav.setRoot(PncHomePage);
        },
          error => {
            console.log('go to authentication page');
            this.nav.setRoot(AuthenticationPage);
            // this.rootPage = AuthenticationPage;
          });
      });
      this.putAuthenticatedUserInSession();
      this.initParameters();
    });
  }

  /**
   * Récupère les parametres envoyé par le back
   */
  initParameters() {
    this.parametresProvider.getParams().then(parameters => {
      this.sessionService.parameters = parameters;
    }, error => { });
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
