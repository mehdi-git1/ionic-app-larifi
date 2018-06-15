import { EDossierPNC } from './../app/app.component';
import { IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RotationCardComponent } from './rotation-card/rotation-card';
import { OfflineIndicatorComponent } from './offline-indicator/offline-indicator';
@NgModule({
	declarations: [RotationCardComponent,
		OfflineIndicatorComponent],
	imports: [IonicModule.forRoot(EDossierPNC)],
	exports: [RotationCardComponent,
		OfflineIndicatorComponent],
	providers: [DatePipe]
})
export class ComponentsModule { }
