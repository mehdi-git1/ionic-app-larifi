import { WaypointCreatePage } from './waypoint-create';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    WaypointCreatePage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(WaypointCreatePage)
  ],
  exports: [
    WaypointCreatePage
  ]
})
export class WaypointCreatePageModule {}
