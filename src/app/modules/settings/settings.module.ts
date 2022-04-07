import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { Config } from '../../../environments/config';
import { AppVersionService } from '../../core/services/app-version/app-version.service';
import { VersionService } from '../../core/services/version/version.service';
import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { AppVersionHistoryPage } from './pages/app-version-history/app-version-history.page';
import { CacheExplorerPage } from './pages/cache-explorer/cache-explorer.page';
import { ImpersonatePage } from './pages/impersonate/impersonate.page';
import { LegalTermsPage } from './pages/legal-terms/legal-terms.page';
import { SettingsPage } from './pages/settings/settings.page';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


@NgModule({
  declarations: [
    SettingsPage,
    ImpersonatePage,
    AppVersionHistoryPage,
    LegalTermsPage,
    CacheExplorerPage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    NgxJsonViewerModule

  ],
  exports: [
    SettingsPage,
    ImpersonatePage,
    AppVersionHistoryPage,
    LegalTermsPage,
    CacheExplorerPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AppVersionService,
    VersionService,
    Config
  ]
})

export class SettingsModule { }
