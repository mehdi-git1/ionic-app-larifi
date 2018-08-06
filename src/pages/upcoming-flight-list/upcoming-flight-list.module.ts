import { UpcomingFlightListPage } from './upcoming-flight-list';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    UpcomingFlightListPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(UpcomingFlightListPage)
  ],
  exports: [
    UpcomingFlightListPage
  ]
})
export class UpcomingFlightListPageModule {}
