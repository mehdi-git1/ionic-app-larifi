import { HelpAssetListPage } from './help-asset-list';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    HelpAssetListPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(HelpAssetListPage)
  ],
  exports: [
    HelpAssetListPage
  ]
})

export class HelpAssetListPageModule {}
