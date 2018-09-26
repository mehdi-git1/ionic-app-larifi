import { StatutoryCertificatePage } from './../pages/statutory-certificate/statutory-certificate';
import { Utils } from './../common/utils';
import { EObservationTransformerProvider } from './../providers/e-observation/e-observation-transformer';
import { OnlineEObservationProvider } from './../providers/e-observation/online-e-observation';
import { OfflineEObservationProvider } from './../providers/e-observation/offline-e-observation';
import { DateTransformService } from './../services/date.transform.service';
import { TransformerService } from './../services/transformer.service';
import { DeviceService } from './../services/device.service';
import { PncPhotoTransformerProvider } from './../providers/pnc-photo/pnc-photo-transformer';
import { OfflinePncPhotoProvider } from './../providers/pnc-photo/offline-pnc-photo';
import { OnlinePncPhotoProvider } from './../providers/pnc-photo/online-pnc-photo';
import { PdfFileViewerPage } from './../pages/pdf-file-viewer/pdf-file-viewer';
import { CrewMemberTransformerProvider } from './../providers/crewMember/crewMember-transformer';
import { OnlineLegProvider } from './../providers/leg/online-leg';
import { OfflineLegProvider } from './../providers/leg/offline-leg';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { SummarySheetPage } from './../pages/summary-sheet/summary-sheet';
import { FlightCrewListPage } from './../pages/flight-crew-list/flight-crew-list';
import { HelpAssetListPage } from './../pages/help-asset-list/help-asset-list';
import { PncSearchPage } from './../pages/pnc-search/pnc-search';
import { UpcomingFlightListPage } from './../pages/upcoming-flight-list/upcoming-flight-list';
import { WaypointCreatePage } from './../pages/waypoint-create/waypoint-create';
import { CareerObjectiveListPage } from './../pages/career-objective-list/career-objective-list';
import { CareerObjectiveCreatePage } from './../pages/career-objective-create/career-objective-create';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { PncHomePage } from './../pages/pnc-home/pnc-home';

import { LegTransformerProvider } from './../providers/leg/leg-transformer';
import { RotationTransformerProvider } from './../providers/rotation/rotation-transformer';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EDossierPNC } from './app.component';

import { SharedModule } from './../shared/shared.module';

import { SummarySheetTransformerProvider } from './../providers/summary-sheet/summary-sheet-transformer';
import { OnlineSummarySheetProvider } from './../providers/summary-sheet/online-summary-sheet';
import { OfflineSummarySheetProvider } from './../providers/summary-sheet/offline-summary-sheet';
import { OnlineWaypointProvider } from './../providers/waypoint/online-waypoint';
import { OnlineCareerObjectiveProvider } from './../providers/career-objective/online-career-objective';
import { OfflineWaypointProvider } from './../providers/waypoint/offline-waypoint';
import { OfflineCareerObjectiveProvider } from './../providers/career-objective/offline-career-objective';
import { OfflineSecurityProvider } from './../providers/security/offline-security';
import { OnlineSecurityProvider } from './../providers/security/online-security';
import { StorageService } from './../services/storage.service';

import { EObservationService } from './../services/eObservation.service';
import { ComponentsModule } from './../components/components.module';
import { WaypointStatusProvider } from './../providers/waypoint-status/waypoint-status';
import { HttpErrorInterceptor } from './../interceptor/httpErrorInterceptor';
import { SessionService } from './../services/session.service';
import { SecurityProvider } from './../providers/security/security';
import { CareerObjectiveProvider } from './../providers/career-objective/career-objective';

import { SecMobilService } from '../services/secMobil.service';
import { AppInitService } from '../services/appInit.service';
import { Config } from '../configuration/environment-variables/config';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { createTranslateLoader } from '../common/translate/TranslateLoader';

import { ConnectivityService } from './../services/connectivity.service';
import { RestService } from '../services/rest.base.service';
import { RestMobileService } from '../services/rest.mobile.service';
import { RestWebService } from '../services/rest.web.service';

import { PncProvider } from '../providers/pnc/pnc';
import { GenderProvider } from '../providers/gender/gender';
import { ToastProvider } from '../providers/toast/toast';
import { CareerObjectiveStatusProvider } from '../providers/career-objective-status/career-objective-status';

import { WaypointProvider } from './../providers/waypoint/waypoint';

import { RotationProvider } from '../providers/rotation/rotation';
import { HelpAssetProvider } from '../providers/help-asset/help-asset';
import { LegProvider } from '../providers/leg/leg';

import { ParametersProvider } from '../providers/parameters/parameters';

import { OfflineProvider } from '../providers/offline/offline';
import { OfflinePncProvider } from '../providers/pnc/offline-pnc';
import { OnlinePncProvider } from '../providers/pnc/online-pnc';
import { CareerObjectiveTransformerProvider } from '../providers/career-objective/career-objective-transformer';
import { WaypointTransformerProvider } from '../providers/waypoint/waypoint-transformer';
import { PncTransformerProvider } from '../providers/pnc/pnc-transformer';
import { SynchronizationProvider } from '../providers/synchronization/synchronization';
import { PncSynchroProvider } from '../providers/synchronization/pnc-synchro';

import { HomePage } from './../pages/home/home';

import { SummarySheetProvider } from '../providers/summary-sheet/summary-sheet';
import { OnlineRotationProvider } from '../providers/rotation/online-rotation';
import { OfflineRotationProvider } from '../providers/rotation/offline-rotation';
import { GenericMessagePage } from '../pages/generic-message/generic-message';

import { SecurityModalService } from '../services/security.modal.service';

import { SettingsPage } from '../pages/settings/settings';
import { PncPhotoProvider } from '../providers/pnc-photo/pnc-photo';
import { SQLite } from '../../node_modules/@ionic-native/sqlite';
import { EObservationProvider } from '../providers/e-observation/e-observation';
import { StatutoryCertificateProvider } from '../providers/statutory-certificate/statutory-certificate';
import { OnlineStatutoryCertificateProvider } from '../providers/statutory-certificate/online-statutory-certificate';
import { StatutoryCertificateTransformerProvider } from './../providers/statutory-certificate/statutory-certificate-transformer';
import { OfflineStatutoryCertificateProvider } from './../providers/statutory-certificate/offline-statutory-certificate';



declare var window: any;

@NgModule({
  declarations: [
    EDossierPNC,
    HomePage,
    PncHomePage,
    AuthenticationPage,
    CareerObjectiveCreatePage,
    CareerObjectiveListPage,
    WaypointCreatePage,
    UpcomingFlightListPage,
    PncSearchPage,
    HelpAssetListPage,
    FlightCrewListPage,
    PncSearchPage,
    HomePage,
    SummarySheetPage,
    PdfFileViewerPage,
    GenericMessagePage,
    SettingsPage,
    StatutoryCertificatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(EDossierPNC, {
      pageTransition: 'md-transition',
      backButtonText: ''
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    HttpClientModule,
    ComponentsModule,
    SharedModule,
    BrowserAnimationsModule,
    PdfViewerModule,
    SimpleNotificationsModule.forRoot({ position: ['top', 'right'] })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EDossierPNC,
    HomePage,
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
    SummarySheetPage,
    PdfFileViewerPage,
    GenericMessagePage,
    SettingsPage,
    StatutoryCertificatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SecMobilService,
    ConnectivityService,
    StorageService,
    DeviceService,
    DateTransformService,
    TransformerService,
    { provide: RestService, useFactory: createRestService, deps: [HttpClient, SecMobilService, Config] },
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
    ParametersProvider,
    HelpAssetProvider,
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
    SynchronizationProvider,
    PncSynchroProvider,
    EObservationService,
    SummarySheetProvider,
    RotationTransformerProvider,
    LegTransformerProvider,
    CrewMemberTransformerProvider,
    OnlineSummarySheetProvider,
    OfflineSummarySheetProvider,
    SummarySheetTransformerProvider,
    OnlineRotationProvider,
    OfflineRotationProvider,
    OnlineLegProvider,
    OfflineLegProvider,
    SecurityModalService,
    PncPhotoProvider,
    OnlinePncPhotoProvider,
    OfflinePncPhotoProvider,
    PncPhotoTransformerProvider,
    SQLite,
    EObservationProvider,
    OfflineEObservationProvider,
    OnlineEObservationProvider,
    EObservationTransformerProvider,
    Utils,
    StatutoryCertificateProvider,
    OnlineStatutoryCertificateProvider,
    OfflineStatutoryCertificateProvider,
    StatutoryCertificateTransformerProvider
  ]
})
export class AppModule { }



// Check if we are in app mode or in web browser
export function createRestService(http: HttpClient, secMobilService: SecMobilService, config: Config): RestService {
  if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
    return new RestMobileService(http, secMobilService);
  } else {
    return new RestWebService(http, config);
  }
}
