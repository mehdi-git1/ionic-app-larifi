import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PdfFileViewerPage } from './pdf-file-viewer';

@NgModule({
  declarations: [
    PdfFileViewerPage,
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(PdfFileViewerPage),
    PdfViewerModule
  ],
  exports: [
    PdfFileViewerPage
  ]
})
export class PdfFileViewerPageModule { }
