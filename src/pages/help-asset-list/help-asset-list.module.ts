import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpAssetListPage } from './help-asset-list';

@NgModule({
  declarations: [
    HelpAssetListPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpAssetListPage),
  ],
})
export class HelpResourceListPageModule { }
