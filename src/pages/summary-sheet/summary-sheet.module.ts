import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SummarySheetPage } from './summary-sheet';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SummarySheetPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(SummarySheetPage),
    PdfViewerModule
  ],
  exports: [
    SummarySheetPage
  ]
})
export class SummarySheetPageModule {}
