import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { HrDocumentCardComponent } from './components/hr-document-card/hr-document-card.component';
import { HrDocumentComponent } from './components/hr-document/hr-document.component';
import {
    HrDocumentActionMenuComponent
} from './pages/hr-document-action-menu/hr-document-action-menu.component';
import { HrDocumentCreatePage } from './pages/hr-document-create/hr-document-create.page';
import { HrDocumentDetailPage } from './pages/hr-document-detail/hr-document-detail.page';
import { HrDocumentsPage } from './pages/hr-documents/hr-documents.page';

@NgModule({
  declarations: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentDetailPage,
    HrDocumentComponent,
    HrDocumentCardComponent,
    HrDocumentActionMenuComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentDetailPage,
    HrDocumentComponent,
    HrDocumentCardComponent,
    HrDocumentActionMenuComponent
  ],
  exports: [
    HrDocumentsPage,
    HrDocumentCreatePage,
    HrDocumentDetailPage,
    HrDocumentComponent,
    HrDocumentCardComponent,
    HrDocumentActionMenuComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class HrDocumentModule { }
