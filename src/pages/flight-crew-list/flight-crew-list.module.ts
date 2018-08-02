import { FlightCrewListPage } from './flight-crew-list';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    FlightCrewListPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(FlightCrewListPage)
  ],
  exports: [
    FlightCrewListPage
  ]
})
export class FlightCrewListPageModule {}
