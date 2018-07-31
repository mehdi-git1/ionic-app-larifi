import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RotationCardComponent } from './rotation-card/rotation-card';
import { OfflineIndicatorComponent } from './offline-indicator/offline-indicator';
import { ConnectivityIndicatorComponent } from './connectivity-indicator/connectivity-indicator';
import { DownloadButtonComponent } from './download-button/download-button';
import { PncCardComponent } from './pnc-card/pnc-card';
import { FlightCardComponent } from './flight-card/flight-card';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
      IonicModule,
      TranslateModule
  ],
  declarations: [RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    FlightCardComponent],
  exports: [RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    FlightCardComponent],
})
export class ComponentsModule { }
