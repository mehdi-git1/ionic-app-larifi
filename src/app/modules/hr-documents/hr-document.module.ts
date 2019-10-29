import { IonicPageModule } from 'ionic-angular';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { HrDocumentCardComponent } from './components/hr-document-card/hr-document-card.component';
import { HrDocumentComponent } from './components/hr-document/hr-document.component';
import { HrDocumentCreatePage } from './pages/hr-document-create/hr-document-create.page';
import { HrDocumentDetailPage } from './pages/hr-document-detail/hr-document-detail.page';
import { HrDocumentsPage } from './pages/hr-documents/hr-documents.page';

@NgModule({
  declarations: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentDetailPage,
    HrDocumentComponent,
    HrDocumentCardComponent

  ],
  imports: [
    [IonicPageModule.forChild(HrDocumentsPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentDetailPage,
    HrDocumentComponent,
    HrDocumentCardComponent
  ],
  exports: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentDetailPage,
    HrDocumentComponent,
    HrDocumentCardComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class HrDocumentModule { }
