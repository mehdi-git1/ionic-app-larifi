import { CareerObjectiveModule } from './modules/career-objective/career-objective.module';
import { RedactionsModule } from './modules/redactions/redactions.module';
import { RegularityModule } from './modules/regularity/pages/regularity/regularity.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { FileModule } from './core/file/file.module';
import { HttpModule } from './core/http/http.module';
import { AppInitService } from './core/services/app-init/app-init.service';
import { ServiceModule } from './core/services/service.module';
import { StorageModule } from './core/storage/storage.module';
import { AdminModule } from './modules/admin/admin.module';
import {
  CongratulationLetterModule
} from './modules/congratulation-letter/congratulation-letter.module';
import { DevelopmentProgramModule } from './modules/development-program/development-program.module';
import { EObservationModule } from './modules/eobservation/eobservation.module';
import { FlightActivityModule } from './modules/flight-activity/flight-activity.module';
import { HelpAssetModule } from './modules/help-asset/help-asset.module';
import { HomeModule } from './modules/home/home.module';
import { HrDocumentModule } from './modules/hr-documents/hr-document.module';
import { LogbookModule } from './modules/logbook/logbook.module';
import { PncTeamModule } from './modules/pnc-team/pnc-team.module';
import {
  ProfessionalInterviewModule
} from './modules/professional-interview/professional-interview.module';
import { ProfessionalLevelModule } from './modules/professional-level/professional-level.module';
import { SettingsModule } from './modules/settings/settings.module';
import {
  StatutoryCertificateModule
} from './modules/statutory-certificate/statutory-certificate.module';
import { SynchronizationModule } from './modules/synchronization/synchronization.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { ComponentsModule } from './shared/components/components.module';
import {
  PinPadModalComponent
} from './shared/components/modals/pin-pad-modal/pin-pad-modal.component';
import { SharedModule } from './shared/shared.module';

export function appInitFactory(appInitService: AppInitService) {
  return () => {
    return Promise.all([
      appInitService.initApp()
    ]);
  };
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [PinPadModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md',
      // TODO animations de navigation désactivées en attendant d'avoir une solution pour le soucis de blink lors d'une navigation
      animated: false
    }),
    HttpClientModule,
    AuthenticationModule,
    CareerObjectiveModule,
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
    SimpleNotificationsModule.forRoot({ position: ['top', 'right'] }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HrDocumentModule,
    RegularityModule,
    RedactionsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [AppInitService],
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
