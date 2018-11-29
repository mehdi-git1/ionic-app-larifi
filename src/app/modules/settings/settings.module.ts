import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {SettingsPage} from './pages/settings/settings.page';
import {ImpersonatePage} from './pages/impersonate/impersonate.page';


@NgModule({
  declarations: [
    SettingsPage,
    ImpersonatePage
  ],
  imports: [
    [IonicPageModule.forChild(SettingsPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    SettingsPage,
    ImpersonatePage
  ],
  exports: [
    SettingsPage,
    ImpersonatePage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class SettingsModule{}
