import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {HelpAssetListPage} from './pages/help-asset-list/help-asset-list.page';


@NgModule({
  declarations: [
    HelpAssetListPage
  ],
  imports: [
    [IonicPageModule.forChild(HelpAssetListPage)],
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
  providers: []
})

export class HelpAssetModule{}
