import { LogbookModule } from './modules/logbook/logbook.module';
import { EObservationModule } from './modules/eobservation/eobservation.module';
import { CongratulationLetterModule } from './modules/congratulation-letter/congratulation-letter.module';
import { AdminModule } from './modules/admin/admin.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { SimpleNotificationsModule } from 'angular2-notifications';

import { EDossierPNC } from './app.component';

import { SharedModule } from './shared/shared.module';
import { HomeModule } from './modules/home/home.module';
import { DevelopmentProgramModule } from './modules/development-program/development-program.module';
import { FlightActivityModule } from './modules/flight-activity/flight-activity.module';
import { HelpAssetModule } from './modules/help-asset/help-asset.module';
import { PncTeamModule } from './modules/pnc-team/pnc-team.module';
import { ProfessionalLevelModule } from './modules/professional-level/professional-level.module';
import { SettingsModule } from './modules/settings/settings.module';
import { StatutoryCertificateModule } from './modules/statutory-certificate/statutory-certificate.module';
import { ServiceModule } from './core/services/service.module';
import { ComponentsModule } from './shared/components/components.module';
import { HttpModule } from './core/http/http.module';
import { StorageModule } from './core/storage/storage.module';
import { Config } from '../environments/config';
import { UrlConfiguration } from './core/configuration/url.configuration';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { FileModule } from './core/file/file.module';
import { SynchronizationModule } from './modules/synchronization/synchronization.module';
import { ProfessionalInterviewModule } from './modules/professional-interview/professional-interview.module';

import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeFr);
@NgModule({
  declarations: [
    EDossierPNC
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(EDossierPNC, {
      pageTransition: 'md-transition',
      backButtonText: ''
    }),
    HttpClientModule,
    AuthenticationModule,
    DevelopmentProgramModule,
    HomeModule,
    FlightActivityModule,
    HelpAssetModule,
    PncTeamModule,
    ProfessionalLevelModule,
    ProfessionalInterviewModule,
    SettingsModule,
    StatutoryCertificateModule,
    EObservationModule,
    CongratulationLetterModule,
    LogbookModule,
    SynchronizationModule,
    AdminModule,
    ComponentsModule,
    SharedModule,
    HttpModule,
    FileModule,
    ServiceModule,
    StorageModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot({ position: ['top', 'right'] })
  ],
  bootstrap: [IonicApp],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    EDossierPNC
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    StatusBar,
    SplashScreen,
    Config,
    UrlConfiguration,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InAppBrowser
  ]
})
export class AppModule { }


