import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { IonicModule } from '@ionic/angular';

import { DirectivesModule } from '../directives/directives.module';
import { SharedModule } from '../shared.module';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AppVersionAlertComponent } from './app-version-alert/app-version-alert.component';
import { BootstrapComponent } from './bootstrap/bootstrap.component';
import { CheckboxAndLabelComponent } from './checkbox-and-label/checkbox-and-label.component';
import { ColorStatusPointComponent } from './color-status-point/color-status-point.component';
import { ColumnSorterComponent } from './column-sorter/column-sorter.component';
import {
  ConnectivityIndicatorComponent
} from './connectivity-indicator/connectivity-indicator.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { DocumentManagerComponent } from './document/document-manager.component';
import { DownloadButtonComponent } from './download-button/download-button.component';
import { EdospncDatetimeComponent } from './edospnc-datetime/edospnc-datetime.component';
import {
  EdospncExpandableBlockComponent
} from './edospnc-expandable-block/edospnc-expandable-block';
import { NavBarCustomComponent } from './edossier-indicators/edossier-indicators.component';
import { EdossierSpinnerComponent } from './edossier-spinner/edossier-spinner.component';
import { PinPadModalComponent } from './modals/pin-pad-modal/pin-pad-modal.component';
import {
  SecretQuestionModalComponent
} from './modals/secret-question-modal/secret-question-modal.component';
import { NoDataComponent } from './no-data/no-data.component';
import { OfflineIndicatorComponent } from './offline-indicator/offline-indicator.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PinPadComponent } from './pin-pad/pin-pad.component';
import { PncAutoCompleteComponent } from './pnc-autocomplete/pnc-autocomplete.component';
import { PncCardComponent } from './pnc-card/pnc-card.component';
import { PncEdossierHeaderComponent } from './pnc-edossier-header/pnc-edossier-header.component';
import { PncHeaderComponent } from './pnc-header/pnc-header.component';
import { PncPhotoComponent } from './pnc-photo/pnc-photo.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { RadioAndLabelComponent } from './radio-and-label/radio-and-label.component';
import { SecretQuestionComponent } from './secret-question/secret-question.component';
import { SortListComponent } from './sort-list/sort-list.component';
import { TabHeaderComponent } from './tab-header/tab-header.component';
import { TabNavComponent } from './tab-nav/tab-nav.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { TruncatedTextComponent } from './truncated-text/truncated-text.component';
import { UserMessageAlertComponent } from './user-message-alert/user-message-alert.component';
import { ValueOrNoDataComponent } from './value-or-no-data/value-or-no-data.component';
import { WorkRateCircleComponent } from './work-rate-circle/work-rate-circle.component';
import { MailingModalComponent } from './modals/mailing-modal/mailing-modal.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DirectivesModule,
    SharedModule,
    HttpClientModule,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,

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
    MailingModalComponent,
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
    AppVersionAlertComponent,
    TextEditorComponent,
    DocumentManagerComponent,
    PncAutoCompleteComponent,
    DocumentViewerComponent,
    WorkRateCircleComponent,
    ProgressBarComponent,
    EdospncDatetimeComponent,
    PageNotFoundComponent,
    BootstrapComponent,
    ColumnSorterComponent,
    AlertDialogComponent,
    ValueOrNoDataComponent,
    TruncatedTextComponent,
    SortListComponent

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
    MailingModalComponent,
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
    AppVersionAlertComponent,
    DocumentManagerComponent,
    PncAutoCompleteComponent,
    DocumentViewerComponent,
    WorkRateCircleComponent,
    TextEditorComponent,
    ProgressBarComponent,
    EdospncDatetimeComponent,
    BootstrapComponent,
    ColumnSorterComponent,
    AlertDialogComponent,
    ValueOrNoDataComponent,
    TruncatedTextComponent,
    SortListComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [Keyboard]
})
export class ComponentsModule { }
