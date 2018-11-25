import { VersionService } from './../../core/services/version/version.service';
import { AppVersion } from '@ionic-native/app-version';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { AdminHomePage } from './pages/admin/home/admin-home.page';
import { SettingsPage } from './pages/settings/settings.page';
import { ImpersonatePage } from './pages/impersonate/impersonate.page';
import { Config } from '../../../environments/config';


@NgModule({
  declarations: [
    AdminHomePage,
    SettingsPage,
    ImpersonatePage
  ],
  imports: [
    [IonicPageModule.forChild(SettingsPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    AdminHomePage,
    SettingsPage,
    ImpersonatePage
  ],
  exports: [
    AdminHomePage,
    SettingsPage,
    ImpersonatePage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AppVersion,
    VersionService,
    Config
  ]
})

export class SettingsModule { }
