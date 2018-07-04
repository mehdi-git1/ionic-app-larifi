import { EDossierPNC } from './../app/app.component';
import { IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RotationCardComponent } from './rotation-card/rotation-card';
import { OfflineIndicatorComponent } from './offline-indicator/offline-indicator';
import { ConnectivityIndicatorComponent } from './connectivity-indicator/connectivity-indicator';
@NgModule({
	declarations: [RotationCardComponent,
		OfflineIndicatorComponent,
    ConnectivityIndicatorComponent],
	imports: [IonicModule.forRoot(EDossierPNC)],
	exports: [RotationCardComponent,
		OfflineIndicatorComponent,
    ConnectivityIndicatorComponent],
	providers: [DatePipe]
})
export class ComponentsModule { }
