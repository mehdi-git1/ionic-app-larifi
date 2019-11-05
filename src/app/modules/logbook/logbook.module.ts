import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import {
    LogbookEventActionMenuComponent
} from './components/logbook-event-action-menu/logbook-event-action-menu.component';
import { LogbookEventComponent } from './components/logbook-event/logbook-event.component';
import { LogbookCreatePage } from './pages/logbook-create/logbook-create.page';
import { LogbookEventDetailsPage } from './pages/logbook-event-details/logbook-event-details.page';
import { LogbookPage } from './pages/logbook/logbook.page';

@NgModule({
  declarations: [
    LogbookPage,
    LogbookCreatePage,
    LogbookEventDetailsPage,
    LogbookEventComponent,
    LogbookEventActionMenuComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    LogbookPage,
    LogbookCreatePage,
    LogbookEventDetailsPage,
    LogbookEventComponent,
    LogbookEventActionMenuComponent
  ],
  exports: [
    LogbookPage,
    LogbookCreatePage,
    LogbookEventDetailsPage,
    LogbookEventComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class LogbookModule { }
