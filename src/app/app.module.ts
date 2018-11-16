import { ImpersonatePage } from './modules/settings/impersonate/impersonate';
import { OfflineProfessionalLevelProvider } from './core/services/professional-level/offline-professional-level';
import { OnlineProfessionalLevelProvider } from './core/services/professional-level/online-professional-level';
import { StatutoryCertificatePage } from './modules/statutory-certificate/statutory-certificate/statutory-certificate';
import { Utils } from './shared/utils/utils';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EObservationTransformerProvider } from './core/services/e-observation/e-observation-transformer';
import { OnlineEObservationProvider } from './core/services/e-observation/online-e-observation';
import { OfflineEObservationProvider } from './core/services/e-observation/offline-e-observation';
import { DateTransformService } from './../services/date.transform.service';
import { TransformerService } from './../services/transformer.service';
import { DeviceService } from './../services/device.service';
import { PncPhotoTransformerProvider } from './core/services/pnc-photo/pnc-photo-transformer';
import { OfflinePncPhotoProvider } from './core/services/pnc-photo/offline-pnc-photo';
import { OnlinePncPhotoProvider } from './core/services/pnc-photo/online-pnc-photo';

import { CrewMemberTransformerProvider } from './core/services/crewMember/crewMember-transformer';
import { OnlineLegProvider } from './core/services/leg/online-leg';
import { OfflineLegProvider } from './core/services/leg/offline-leg';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { SummarySheetPage } from './modules/summary-sheet/summary-sheet/summary-sheet';
import { FlightCrewListPage } from './modules/flight-activity/flight-crew-list/flight-crew-list';
import { HelpAssetListPage } from './modules/help-asset/help-asset-list/help-asset-list';
import { PncSearchPage } from './modules/pnc-team/pnc-search/pnc-search';
import { UpcomingFlightListPage } from './modules/flight-activity/upcoming-flight-list/upcoming-flight-list';
import { WaypointCreatePage } from './modules/development-program/waypoint-create/waypoint-create';
import { CareerObjectiveListPage } from './modules/development-program/career-objective-list/career-objective-list';
import { CareerObjectiveCreatePage } from './modules/development-program/career-objective-create/career-objective-create';
import { AuthenticationPage } from './modules/home/authentication/authentication';
import { PncHomePage } from './modules/home/pnc-home/pnc-home';

import { LegTransformerProvider } from './core/services/leg/leg-transformer';
import { RotationTransformerProvider } from './core/services/rotation/rotation-transformer';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EDossierPNC } from './app.component';

import { SharedModule } from './shared/shared.module';

import { SummarySheetTransformerProvider } from './core/services/summary-sheet/summary-sheet-transformer';
import { OnlineSummarySheetProvider } from './core/services/summary-sheet/online-summary-sheet';
import { OfflineSummarySheetProvider } from './core/services/summary-sheet/offline-summary-sheet';
import { OnlineWaypointProvider } from './core/services/waypoint/online-waypoint';
import { OnlineCareerObjectiveProvider } from './core/services/career-objective/online-career-objective';
import { OfflineWaypointProvider } from './core/services/waypoint/offline-waypoint';
import { OfflineCareerObjectiveProvider } from './core/services/career-objective/offline-career-objective';
import { OfflineSecurityProvider } from './core/services/security/offline-security';
import { OnlineSecurityProvider } from './core/services/security/online-security';
import { StorageService } from './../services/storage.service';

import { EObservationService } from './../services/eObservation.service';
import { ComponentsModule } from './shared/components/components.module';
import { WaypointStatusProvider } from './core/services/waypoint-status/waypoint-status';
import { HttpErrorInterceptor } from './core/interceptor/httpErrorInterceptor';
import { SessionService } from './../services/session.service';
import { AuthorizationService } from '../services/authorization/authorization.service';
import { SecurityProvider } from './core/services/security/security';
import { CareerObjectiveProvider } from './core/services/career-objective/career-objective';

import { SecMobilService } from '../services/secMobil.service';
import { AppInitService } from '../services/appInit.service';
import { Config } from '../configuration/environment-variables/config';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ConnectivityService } from '../services/connectivity/connectivity.service';
import { RestService } from '../services/rest/rest.base.service';
import { RestMobileService } from '../services/rest/rest.mobile.service';
import { RestWebService } from '../services/rest/rest.web.service';

import { PncProvider } from './core/services/pnc/pnc';
import { GenderProvider } from './core/services/gender/gender';
import { ToastProvider } from './core/services/toast/toast';
import { CareerObjectiveStatusProvider } from './core/services/career-objective-status/career-objective-status';

import { WaypointProvider } from './core/services/waypoint/waypoint';

import { RotationProvider } from './core/services/rotation/rotation';
import { HelpAssetProvider } from './core/services/help-asset/help-asset';
import { LegProvider } from './core/services/leg/leg';

import { ParametersProvider } from './core/services/parameters/parameters';

import { OfflineProvider } from './core/services/offline/offline';
import { OfflinePncProvider } from './core/services/pnc/offline-pnc';
import { OnlinePncProvider } from './core/services/pnc/online-pnc';
import { CareerObjectiveTransformerProvider } from './core/services/career-objective/career-objective-transformer';
import { WaypointTransformerProvider } from './core/services/waypoint/waypoint-transformer';
import { PncTransformerProvider } from './core/services/pnc/pnc-transformer';
import { SynchronizationProvider } from './core/services/synchronization/synchronization';
import { PncSynchroProvider } from './core/services/synchronization/pnc-synchro';

import { SummarySheetProvider } from './core/services/summary-sheet/summary-sheet';
import { OnlineRotationProvider } from './core/services/rotation/online-rotation';
import { OfflineRotationProvider } from './core/services/rotation/offline-rotation';
import { GenericMessagePage } from './modules/home/generic-message/generic-message';

import { SecurityModalService } from '../services/security.modal.service';

import { SettingsPage } from './modules/settings/settings/settings';
import { PncPhotoProvider } from './core/services/pnc-photo/pnc-photo';
import { SQLite } from '../../node_modules/@ionic-native/sqlite';
import { EObservationProvider } from './core/services/e-observation/e-observation';
import { StatutoryCertificateProvider } from './core/services/statutory-certificate/statutory-certificate';
import { OnlineStatutoryCertificateProvider } from './core/services/statutory-certificate/online-statutory-certificate';
import { StatutoryCertificateTransformerProvider } from './core/services/statutory-certificate/statutory-certificate-transformer';
import { OfflineStatutoryCertificateProvider } from './core/services/statutory-certificate/offline-statutory-certificate';
import { DirectivesModule } from './shared/directives/directives.module';
import { ProfessionalLevelPage } from './modules/professional-level/professional-level/professional-level';
import { ProfessionalLevelProvider } from './core/services/professional-level/professional-level';
import { ProfessionalLevelTransformerProvider } from './core/services/professional-level/professional-level-transformer';

import { AdminModule } from './modules/settings/admin/admin.module';
import { TabNavService } from '../services/tab-nav/tab-nav.service';


declare var window: any;

@NgModule({
  declarations: [
    EDossierPNC,
    ImpersonatePage,
    PncHomePage,
    AuthenticationPage,
    CareerObjectiveCreatePage,
    CareerObjectiveListPage,
    WaypointCreatePage,
    UpcomingFlightListPage,
    PncSearchPage,
    HelpAssetListPage,
    FlightCrewListPage,
    SummarySheetPage,
    GenericMessagePage,
    SettingsPage,
    StatutoryCertificatePage,
    ProfessionalLevelPage
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
    SimpleNotificationsModule.forRoot({ position: ['top', 'right'] }),
    DirectivesModule,
    AdminModule
  ],
  bootstrap: [IonicApp],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    EDossierPNC,
    ImpersonatePage,
    PncHomePage,
    PncSearchPage,
    AuthenticationPage,
    CareerObjectiveCreatePage,
    CareerObjectiveListPage,
    WaypointCreatePage,
    UpcomingFlightListPage,
    FlightCrewListPage,
    HelpAssetListPage,
    SummarySheetPage,
    GenericMessagePage,
    SettingsPage,
    StatutoryCertificatePage,
    ProfessionalLevelPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SecMobilService,
    ConnectivityService,
    StorageService,
    DeviceService,
    DateTransformService,
    TabNavService,
    TransformerService,
    { provide: RestService, useFactory: createRestService, deps: [HttpClient, SessionService, SecMobilService, Config] },
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
    AuthorizationService,
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
    StatutoryCertificateTransformerProvider,
    InAppBrowser,
    File,
    ProfessionalLevelProvider,
    OnlineProfessionalLevelProvider,
    OfflineProfessionalLevelProvider,
    ProfessionalLevelTransformerProvider
  ]
})
export class AppModule { }

// Check if we are in app mode or in web browser
export function createRestService(http: HttpClient, sessionService: SessionService, secMobilService: SecMobilService, config: Config): RestService {
  if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
    return new RestMobileService(http, secMobilService, sessionService);
  } else {
    return new RestWebService(http, config, sessionService);
  }
}
