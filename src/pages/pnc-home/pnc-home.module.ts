import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PncHomePage } from './pnc-home';

@NgModule({
  declarations: [
    PncHomePage,
  ],
  imports: [
    IonicPageModule.forChild(PncHomePage),
  ],
})
export class PncHomePageModule {}
