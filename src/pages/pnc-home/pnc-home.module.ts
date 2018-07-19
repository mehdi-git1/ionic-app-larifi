import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { PncHomePage } from './pnc-home';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PncHomePage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(PncHomePage)
  ],
  exports: [
    PncHomePage
  ]
})
export class PncHomePageModule {}
