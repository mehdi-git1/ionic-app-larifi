import { SecretQuestionComponent } from './secret-question/secret-question';
import { SecretQuestionModal } from './modals/secret-question-modal/secret-question-modal';
import { IonicModule } from 'ionic-angular';
import { DatePipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RotationCardComponent } from './rotation-card/rotation-card';
import { OfflineIndicatorComponent } from './offline-indicator/offline-indicator';
import { ConnectivityIndicatorComponent } from './connectivity-indicator/connectivity-indicator';
import { DownloadButtonComponent } from './download-button/download-button';
import { PncCardComponent } from './pnc-card/pnc-card';
import { FlightCardComponent } from './flight-card/flight-card';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { EdossierSpinnerComponent } from './edossier-spinner/edossier-spinner';

import { PinPadModal } from './modals/pin-pad-modal/pin-pad-modal';
import { PinPadComponent } from './pin-pad/pin-pad';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule
  ],
  declarations: [
    RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    FlightCardComponent,
    EdossierSpinnerComponent,
    PinPadComponent,
    PinPadModal,
    SecretQuestionModal,
    SecretQuestionComponent
  ],
  exports: [
    RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    FlightCardComponent,
    EdossierSpinnerComponent,
    PinPadComponent,
    PinPadModal,
    SecretQuestionModal,
    SecretQuestionComponent
  ],
  entryComponents: [
    PinPadModal,
    SecretQuestionModal
  ],
  providers: [DatePipe]

})
export class ComponentsModule { }
