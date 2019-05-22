import { InsupportedNavigatorMessagePage } from './pages/insupported-navigator/insupported-navigator-message.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { PncHomePage } from './pages/pnc-home/pnc-home.page';
import { GenericMessagePage } from './pages/generic-message/generic-message.page';
import { AuthenticationPage } from './pages/authentication/authentication.page';


@NgModule({
  declarations: [
    PncHomePage,
    GenericMessagePage,
    AuthenticationPage,
    InsupportedNavigatorMessagePage
  ],
  imports: [
    [IonicPageModule.forChild(PncHomePage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    GenericMessagePage,
    AuthenticationPage,
    InsupportedNavigatorMessagePage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class HomeModule { }
