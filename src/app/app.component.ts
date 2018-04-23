import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
import { PncHomePage } from '../pages/pnc-home/pnc-home';
import { AuthenticationPage } from '../pages/authentication/authentication';
import { SecMobilService } from '../services/secMobil.service';

@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = PncHomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
      public splashScreen: SplashScreen,public translate: TranslateService,
      private secMobilService: SecMobilService
    ) {
    
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translate.setDefaultLang('en'); 
      this.translate.use('en');

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
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
