import { OnlineWaypointProvider } from './../providers/waypoint/online-waypoint';
import { OnlineCareerObjectiveProvider } from './../providers/career-objective/online-career-objective';
import { OfflineWaypointProvider } from './../providers/waypoint/offline-waypoint';
import { OfflineCareerObjectiveProvider } from './../providers/career-objective/offline-career-objective';
import { OfflineSecurityProvider } from './../providers/security/offline-security';
import { OnlineSecurityProvider } from './../providers/security/online-security';
import { StorageService } from './../services/storage.service';
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

import { ConnectivityService } from './../services/connectivity.service';
import { OfflineService } from './../services/rest.offline.service';
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
import { LegProvider } from '../providers/leg/leg';
import { IonicStorageModule } from '@ionic/storage';
import { OfflineProvider } from '../providers/offline/offline';
import { SQLite } from '@ionic-native/sqlite';
import { OfflinePncProvider } from '../providers/pnc/offline-pnc';
import { OnlinePncProvider } from '../providers/pnc/online-pnc';
import { CareerObjectiveTransformerProvider } from '../providers/career-objective/career-objective-transformer';
import { WaypointTransformerProvider } from '../providers/waypoint/waypoint-transformer';
import { PncTransformerProvider } from '../providers/pnc/pnc-transformer';
import { SynchronizationProvider } from '../providers/synchronization/synchronization';

@NgModule({
  declarations: [
    EDossierPNC,
    PncHomePage,
    AuthenticationPage,
    CareerObjectiveCreatePage,
    CareerObjectiveListPage,
    WaypointCreatePage,
    UpcomingFlightListPage,
    FlightCrewListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(EDossierPNC),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ComponentsModule,
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
    PncHomePage,
    AuthenticationPage,
    CareerObjectiveCreatePage,
    CareerObjectiveListPage,
    WaypointCreatePage,
    UpcomingFlightListPage,
    FlightCrewListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SecMobilService,
    ConnectivityService,
    OfflineService,
    StorageService,
    {
      provide: RestService,
      useFactory: createRestService,
      deps: [HttpClient, SecMobilService, ConnectivityService, OfflineService]
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    AppInitService,
    HttpClientModule,
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
    OfflineProvider,
    OfflineCareerObjectiveProvider,
    OfflinePncProvider,
    OfflineCareerObjectiveProvider,
    OfflineWaypointProvider,
    OnlineSecurityProvider,
    OfflineSecurityProvider,
    OnlinePncProvider,
    OnlineCareerObjectiveProvider,
    OfflineCareerObjectiveProvider,
    OfflineWaypointProvider,
    OnlineWaypointProvider,
    CareerObjectiveTransformerProvider,
    WaypointTransformerProvider,
    PncTransformerProvider,
    SynchronizationProvider
  ]
})
export class AppModule { }


declare var window: any;

// Check if we are in app mode or in web browser
export function createRestService(http: HttpClient,
  secMobilService: SecMobilService,
  connectivityService: ConnectivityService,
  offlineService: OfflineService, storage: Storage): RestService {
  if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
    console.log('mobile mode selected');
    return new RestMobileService(http, secMobilService);
  } else {
    console.log('web mode selected');
    return new RestWebService(http, connectivityService, offlineService);
  }
}
