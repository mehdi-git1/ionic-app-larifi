import { AuthenticationPage } from './authentication';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    AuthenticationPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(AuthenticationPage)
  ],
  exports: [
    AuthenticationPage
  ]
})
export class AuthenticationPageModule {}
