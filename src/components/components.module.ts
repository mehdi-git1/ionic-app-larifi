import { EDossierPNC } from './../app/app.component';
import { IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RotationCardComponent } from './rotation-card/rotation-card';
@NgModule({
	declarations: [RotationCardComponent],
	imports: [IonicModule.forRoot(EDossierPNC)],
	exports: [RotationCardComponent],
	providers: [DatePipe]
})
export class ComponentsModule { }
