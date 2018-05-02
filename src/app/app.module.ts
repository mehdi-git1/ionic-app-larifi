import { CareerObjectiveProvider } from './../providers/career-objective/career-objective';
import { PncHomePage } from './../pages/pnc-home/pnc-home';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CareerObjectiveCreatePage } from './../pages/career-objective-create/career-objective-create';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { EDossierPNC } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationPage } from '../pages/authentication/authentication';
import { SecMobilService } from '../services/secMobil.service';
import { AppInitService } from '../services/appInit.service';
import { Config } from '../configuration/environment-variables/config';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createTranslateLoader } from '../common/translate/TranslateLoader';
import { ConnectivityService } from '../services/connectivity.service';
import { RestService } from '../services/rest.base.service';
import { RestMobileService } from '../services/rest.mobile.service';
import { RestWebService } from '../services/rest.web.service';
import { PncProvider } from '../providers/pnc/pnc';
//import { CareerObjectiveProvider } from '../providers/career-objective/career-objective';


@NgModule({
  declarations: [
    EDossierPNC,
    HomePage,
    PncHomePage,
    AuthenticationPage,
    CareerObjectiveCreatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(EDossierPNC),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EDossierPNC,
    HomePage,
    PncHomePage,
    AuthenticationPage,
    CareerObjectiveCreatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SecMobilService,
    ConnectivityService,
    { provide: RestService, useFactory: createRestService, deps: [HttpClient, SecMobilService] },
    AppInitService, HttpClientModule,
    Config,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PncProvider,
    CareerObjectiveProvider
  ]
})
export class AppModule { }


declare var window: any;

//Check if we are in app mode or in web browser
export function createRestService(http: HttpClient, secMobilService: SecMobilService): RestService {
  if (undefined != window.cordova && 'browser' !== window.cordova.platformId) {
    console.log("mobile mode selected");
    return new RestMobileService(http, secMobilService);
  } else {
    console.log("web mode selected");
    return new RestWebService(http);
  }
}