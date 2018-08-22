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
import { PncSearchFilterComponent } from './pnc-search-filter/pnc-search-filter';
import { PncPhotoComponent } from './pnc-photo/pnc-photo';

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
        PncSearchFilterComponent,
        PncPhotoComponent
    ],
    exports: [
        RotationCardComponent,
        OfflineIndicatorComponent,
        ConnectivityIndicatorComponent,
        DownloadButtonComponent,
        PncCardComponent,
        FlightCardComponent,
        EdossierSpinnerComponent,
        PncSearchFilterComponent,
        PncPhotoComponent
    ],
    providers: [DatePipe]

})
export class ComponentsModule { }
