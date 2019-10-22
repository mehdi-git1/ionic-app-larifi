import { IonicPageModule } from 'ionic-angular';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { HrDocumentComponent } from './components/hr-document/hr-document.component';
import { HrDocumentCreatePage } from './pages/hr-document-create/hr-document-create.page';
import { HrDocumentsPage } from './pages/hr-documents/hr-documents.page';

@NgModule({
  declarations: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentComponent

  ],
  imports: [
    [IonicPageModule.forChild(HrDocumentsPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentComponent
  ],
  exports: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class HrDocumentModule { }
