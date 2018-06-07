import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpResourceListPage } from './help-resource-list';

@NgModule({
  declarations: [
    HelpResourceListPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpResourceListPage),
  ],
})
export class HelpResourceListPageModule {}
