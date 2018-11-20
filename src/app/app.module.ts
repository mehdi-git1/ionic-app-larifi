import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { SimpleNotificationsModule } from 'angular2-notifications';

import { EDossierPNC } from './app.component';

import { SharedModule } from './shared/shared.module';
import {HomeModule} from './modules/home/home.module';
import {DevelopmentProgramModule} from './modules/development-program/development-program.module';
import {FlightActivityModule} from './modules/flight-activity/flight-activity.module';
import {HelpAssetModule} from './modules/help-asset/help-asset.module';
import {PncTeamModule} from './modules/pnc-team/pnc-team.module';
import {ProfessionalLevelModule} from './modules/professional-level/professional-level.module';
import {SettingsModule} from './modules/settings/settings.module';
import {StatutoryCertificateModule} from './modules/statutory-certificate/statutory-certificate.module';
import {SummarySheetModule} from './modules/summary-sheet/summary-sheet.module';
import {ServiceModule} from './core/services/service.module';
import { ComponentsModule } from './shared/components/components.module';
import {HttpModule} from './core/http/http.module';
import {StorageModule} from './core/storage/storage.module';
import {Config} from '../environments/config';
import {UrlConfiguration} from './core/configuration/url.configuration';


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
    DevelopmentProgramModule,
    HomeModule,
    FlightActivityModule,
    HelpAssetModule,
    PncTeamModule,
    ProfessionalLevelModule,
    SettingsModule,
    StatutoryCertificateModule,
    SummarySheetModule,
    ComponentsModule,
    SharedModule,
    HttpModule,
    ServiceModule,
    StorageModule,
    BrowserAnimationsModule,
    PdfViewerModule,
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
    StatusBar,
    SplashScreen,
   Config,
    UrlConfiguration,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InAppBrowser,
    File,
  ]
})
export class AppModule { }


