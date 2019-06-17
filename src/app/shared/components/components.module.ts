import { TabHeaderComponent } from './tab-header/tab-header.component';
import { PncHeaderComponent } from './pnc-header/pnc-header.component';
import { PdfButtonComponent } from './pdf-button/pdf-button.component';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { NgxEditorModule } from 'ngx-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HttpClientModule } from '@angular/common/http';

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
import { EdospncExpandableBlockComponent } from './edospnc-expandable-block/edospnc-expandable-block';
import { ColorStatusPointComponent } from './color-status-point/color-status-point.component';
import { RadioAndLabelComponent } from './radio-and-label/radio-and-label.component';
import { CheckboxAndLabelComponent } from './checkbox-and-label/checkbox-and-label.component';
import { UserMessageAlertComponent } from './user-message-alert/user-message-alert.component';

import { TextEditorComponent } from './text-editor/text-editor.component';

import { AppVersionAlertComponent } from './app-version-alert/app-version-alert.component';
import { PncEdossierHeaderComponent } from './pnc-edossier-header/pnc-edossier-header.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DirectivesModule,
    SharedModule,
    NgxEditorModule,
    AngularFontAwesomeModule,
    TooltipModule,
    HttpClientModule
  ],
  declarations: [
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    PncHeaderComponent,
    EdossierSpinnerComponent,
    PinPadComponent,
    PinPadModalComponent,
    SecretQuestionModalComponent,
    SecretQuestionComponent,
    NavBarCustomComponent,
    PncPhotoComponent,
    PageHeaderComponent,
    TabNavComponent,
    TabHeaderComponent,
    PncEdossierHeaderComponent,
    NoDataComponent,
    EdospncExpandableBlockComponent,
    ColorStatusPointComponent,
    RadioAndLabelComponent,
    CheckboxAndLabelComponent,
    UserMessageAlertComponent,
    TextEditorComponent,
    PdfButtonComponent,
    AppVersionAlertComponent

  ],
  exports: [
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    PncHeaderComponent,
    EdossierSpinnerComponent,
    PinPadComponent,
    PinPadModalComponent,
    SecretQuestionModalComponent,
    SecretQuestionComponent,
    PageHeaderComponent,
    NavBarCustomComponent,
    PncPhotoComponent,
    TabNavComponent,
    TabHeaderComponent,
    PncEdossierHeaderComponent,
    NoDataComponent,
    EdospncExpandableBlockComponent,
    ColorStatusPointComponent,
    RadioAndLabelComponent,
    CheckboxAndLabelComponent,
    UserMessageAlertComponent,
    TextEditorComponent,
    PdfButtonComponent,
    AppVersionAlertComponent
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
