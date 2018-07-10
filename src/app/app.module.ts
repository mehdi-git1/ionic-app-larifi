import { AppMaterialModule } from './../shared/material/material.module';
import { PncSearchPage } from './../pages/pnc-search/pnc-search';
import { HelpAssetListPage } from './../pages/help-asset-list/help-asset-list';
import { ComponentsModule } from './../components/components.module';
import { FlightCrewListPage } from './../pages/flight-crew-list/flight-crew-list';
import { WaypointStatusProvider } from './../providers/waypoint-status/waypoint-status';
import { HttpErrorInterceptor } from './../interceptor/httpErrorInterceptor';
import { SessionService } from './../services/session.service';
import { SecurityProvider } from './../providers/security/security';
import { CareerObjectiveProvider } from './../providers/career-objective/career-objective';
import { PncHomePage } from './../pages/pnc-home/pnc-home';
import { CareerObjectiveCreatePage } from './../pages/career-objective-create/career-objective-create';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EDossierPNC } from './app.component';
import { CareerObjectiveListPage } from './../pages/career-objective-list/career-objective-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationPage } from '../pages/authentication/authentication';
import { SecMobilService } from '../services/secMobil.service';
import { AppInitService } from '../services/appInit.service';
import { Config } from '../configuration/environment-variables/config';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { createTranslateLoader } from '../common/translate/TranslateLoader';
import { ConnectivityService } from '../services/connectivity.service';
import { RestService } from '../services/rest.base.service';
import { RestMobileService } from '../services/rest.mobile.service';
import { RestWebService } from '../services/rest.web.service';
import { PncProvider } from '../providers/pnc/pnc';
import { GenderProvider } from '../providers/gender/gender';
import { ToastProvider } from '../providers/toast/toast';
import { CareerObjectiveStatusProvider } from '../providers/career-objective-status/career-objective-status';
import { DatePipe } from '@angular/common';
import { WaypointCreatePage } from './../pages/waypoint-create/waypoint-create';
import { WaypointProvider } from './../providers/waypoint/waypoint';
import { UpcomingFlightListPage } from '../pages/upcoming-flight-list/upcoming-flight-list';
import { RotationProvider } from '../providers/rotation/rotation';
import { HelpAssetProvider } from '../providers/help-asset/help-asset';
import { LegProvider } from '../providers/leg/leg';
import { ParametersProvider } from '../providers/parameters/parameters';
import { HomePage } from '../pages/home/home';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SummarySheetPage } from '../pages/summary-sheet/summary-sheet';
import { SummarySheetProvider } from '../providers/summary-sheet/summary-sheet';

@NgModule({
  declarations: [
    EDossierPNC,
    PncHomePage,
    AuthenticationPage,
    CareerObjectiveCreatePage,
    CareerObjectiveListPage,
    WaypointCreatePage,
    UpcomingFlightListPage,
    PncSearchPage,
    HelpAssetListPage,
    FlightCrewListPage,
    HomePage,
    SummarySheetPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(EDossierPNC),
    HttpClientModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppMaterialModule,
    BrowserAnimationsModule,
    PdfViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EDossierPNC,
    PncHomePage,
    AuthenticationPage,
    CareerObjectiveCreatePage,
    CareerObjectiveListPage,
    WaypointCreatePage,
    UpcomingFlightListPage,
    FlightCrewListPage,
    PncSearchPage,
    HelpAssetListPage,
    HomePage,
    SummarySheetPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SecMobilService,
    ConnectivityService,
    { provide: RestService, useFactory: createRestService, deps: [HttpClient, SecMobilService, Config] },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    AppInitService, HttpClientModule,
    Config,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PncProvider,
    CareerObjectiveProvider,
    GenderProvider,
    ToastProvider,
    CareerObjectiveStatusProvider,
    DatePipe,
    SecurityProvider,
    SessionService,
    WaypointProvider,
    WaypointStatusProvider,
    RotationProvider,
    LegProvider,
    ParametersProvider,
    HelpAssetProvider,
    LegProvider,
    SummarySheetProvider
  ]
})
export class AppModule { }


declare var window: any;

// Check if we are in app mode or in web browser
export function createRestService(http: HttpClient, secMobilService: SecMobilService, config: Config): RestService {
  if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
    console.log('mobile mode selected');
    return new RestMobileService(http, secMobilService);
  } else {
    console.log('web mode selected');
    return new RestWebService(http, config);
  }
}
