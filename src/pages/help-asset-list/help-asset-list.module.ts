import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HelpAssetListPage } from './help-asset-list';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { DocumentViewer } from '@ionic-native/document-viewer';

@NgModule({
  declarations: [
    HelpAssetListPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(HelpAssetListPage),
    PdfViewerModule
  ],
  exports: [
    HelpAssetListPage
  ]
})

export class HelpAssetListPageModule { }
