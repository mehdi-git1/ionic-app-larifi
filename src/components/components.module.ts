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
import { NavBarCustomComponent } from './edossier-indicators/edossier-indicators';

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
    NavBarCustomComponent
  ],
  exports: [
    RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    FlightCardComponent,
    EdossierSpinnerComponent,
    NavBarCustomComponent
  ],
  providers: [DatePipe]

})
export class ComponentsModule { }
