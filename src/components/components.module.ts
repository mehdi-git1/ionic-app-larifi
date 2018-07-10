import { EDossierPNC } from './../app/app.component';
import { IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RotationCardComponent } from './rotation-card/rotation-card';
import { OfflineIndicatorComponent } from './offline-indicator/offline-indicator';
import { ConnectivityIndicatorComponent } from './connectivity-indicator/connectivity-indicator';
import { PncCardComponent } from './pnc-card/pnc-card';
import { FlightCardComponent } from './flight-card/flight-card';
import { TranslateModule } from '@ngx-translate/core';
import { DownloadButtonComponent } from './download-button/download-button';
@NgModule({
  declarations: [RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    PncCardComponent,
    FlightCardComponent,
    DownloadButtonComponent],
  imports: [IonicModule.forRoot(EDossierPNC), TranslateModule],
  exports: [RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    PncCardComponent,
    FlightCardComponent,
    DownloadButtonComponent],
  providers: [DatePipe]
})
export class ComponentsModule { }
