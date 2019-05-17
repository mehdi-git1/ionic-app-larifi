import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPageModule } from 'ionic-angular';

import { Config } from '../../../environments/config';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

import { SettingsPage } from './pages/settings/settings.page';
import { ImpersonatePage } from './pages/impersonate/impersonate.page';
import { AppVersionHistoryPage } from './pages/app-version-history/app-version-history.page';

import { VersionService } from '../../core/services/version/version.service';

@NgModule({
  declarations: [
    SettingsPage,
    ImpersonatePage,
    AppVersionHistoryPage
  ],
  imports: [
    [IonicPageModule.forChild(SettingsPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    SettingsPage,
    ImpersonatePage,
    AppVersionHistoryPage
  ],
  exports: [
    SettingsPage,
    ImpersonatePage,
    AppVersionHistoryPage
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
