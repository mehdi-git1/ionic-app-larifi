import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { HelpAssetListPage } from './pages/help-asset-list/help-asset-list.page';

@NgModule({
  declarations: [
    HelpAssetListPage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    HelpAssetListPage
  ],
  exports: [
    HelpAssetListPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [InAppBrowser]
})

export class HelpAssetModule { }
