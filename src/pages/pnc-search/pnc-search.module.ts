
import { PncSearchPage } from './pnc-search';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PncSearchPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(PncSearchPage)
  ],
  exports: [
    PncSearchPage
  ]
})
export class PncSearchPageModule {}
