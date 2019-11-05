import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthenticationPage } from './pages/authentication/authentication.page';
import { GenericMessagePage } from './pages/generic-message/generic-message.page';
import { PncHomePage } from './pages/pnc-home/pnc-home.page';
import {
    UnsupportedNavigatorMessagePage
} from './pages/unsupported-navigator/unsupported-navigator-message.page';

@NgModule({
  declarations: [
    PncHomePage,
    GenericMessagePage,
    AuthenticationPage,
    UnsupportedNavigatorMessagePage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    GenericMessagePage,
    AuthenticationPage,
    UnsupportedNavigatorMessagePage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class HomeModule { }
