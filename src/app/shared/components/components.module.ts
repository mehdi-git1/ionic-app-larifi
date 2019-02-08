import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { OfflineIndicatorComponent } from './offline-indicator/offline-indicator.component';
import { ConnectivityIndicatorComponent } from './connectivity-indicator/connectivity-indicator.component';
import { DownloadButtonComponent } from './download-button/download-button.component';
import { PncCardComponent } from './pnc-card/pnc-card.component';
import { EdossierSpinnerComponent } from './edossier-spinner/edossier-spinner.component';
import { NavBarCustomComponent } from './edossier-indicators/edossier-indicators.component';
import { PncPhotoComponent } from './pnc-photo/pnc-photo.component';
import { PageHeaderComponent } from './page-header/page-header.component';

import { PinPadModalComponent } from './modals/pin-pad-modal/pin-pad-modal.component';
import { PinPadComponent } from './pin-pad/pin-pad.component';

import { SecretQuestionComponent } from './secret-question/secret-question.component';
import { SecretQuestionModalComponent } from './modals/secret-question-modal/secret-question-modal.component';

import { TabNavComponent } from './tab-nav/tab-nav.component';
import { NoDataComponent } from './no-data/no-data.component';
import { DirectivesModule } from '../directives/directives.module';
import { SharedModule } from '../shared.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DirectivesModule,
    SharedModule
  ],
  declarations: [
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    EdossierSpinnerComponent,
    PinPadComponent,
    PinPadModalComponent,
    SecretQuestionModalComponent,
    SecretQuestionComponent,
    NavBarCustomComponent,
    PncPhotoComponent,
    PageHeaderComponent,
    TabNavComponent,
    NoDataComponent
  ],
  exports: [
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    EdossierSpinnerComponent,
    PinPadComponent,
    PinPadModalComponent,
    SecretQuestionModalComponent,
    SecretQuestionComponent,
    PageHeaderComponent,
    NavBarCustomComponent,
    PncPhotoComponent,
    TabNavComponent,
    NoDataComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    PinPadModalComponent,
    SecretQuestionModalComponent
  ]
})
export class ComponentsModule { }
