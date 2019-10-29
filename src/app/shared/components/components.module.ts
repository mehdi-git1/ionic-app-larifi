import { IonicModule } from 'ionic-angular';
import { QuillModule } from 'ngx-quill';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from '../directives/directives.module';
import { SharedModule } from '../shared.module';
import { AppVersionAlertComponent } from './app-version-alert/app-version-alert.component';
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
import { PdfButtonComponent } from './pdf-button/pdf-button.component';
import { PinPadComponent } from './pin-pad/pin-pad.component';
import { PncAutoCompleteComponent } from './pnc-autocomplete/pnc-autocomplete.component';
import { PncCardComponent } from './pnc-card/pnc-card.component';
import { PncEdossierHeaderComponent } from './pnc-edossier-header/pnc-edossier-header.component';
import { PncHeaderComponent } from './pnc-header/pnc-header.component';
import { PncPhotoComponent } from './pnc-photo/pnc-photo.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { RadioAndLabelComponent } from './radio-and-label/radio-and-label.component';
import { SecretQuestionComponent } from './secret-question/secret-question.component';
import { TabHeaderComponent } from './tab-header/tab-header.component';
import { TabNavComponent } from './tab-nav/tab-nav.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { UserMessageAlertComponent } from './user-message-alert/user-message-alert.component';
import { WorkRateCircleComponent } from './work-rate-circle/work-rate-circle.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        DirectivesModule,
        SharedModule,
        HttpClientModule,
        QuillModule.forRoot(),
        ReactiveFormsModule
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
        PdfButtonComponent,
        AppVersionAlertComponent,
        TextEditorComponent,
        DocumentManagerComponent,
        PncAutoCompleteComponent,
        DocumentViewerComponent,
        WorkRateCircleComponent,
        ProgressBarComponent,
        EdospncDatetimeComponent,
        ColumnSorterComponent
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
        PdfButtonComponent,
        AppVersionAlertComponent,
        DocumentManagerComponent,
        PncAutoCompleteComponent,
        DocumentViewerComponent,
        WorkRateCircleComponent,
        TextEditorComponent,
        ProgressBarComponent,
        EdospncDatetimeComponent,
        ColumnSorterComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [
        PinPadModalComponent,
        SecretQuestionModalComponent,
        DocumentViewerComponent
    ]
})
export class ComponentsModule { }
