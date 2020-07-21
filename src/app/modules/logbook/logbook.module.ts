

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import {
  LogbookEventActionMenuComponent
} from './components/logbook-event-action-menu/logbook-event-action-menu.component';
import {
  LogbookEventDetailsComponent
} from './components/logbook-event-details/logbook-event-details.component';
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
    LogbookEventDetailsComponent,
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
    LogbookEventDetailsComponent,
    LogbookEventActionMenuComponent
  ],
  exports: [
    LogbookPage,
    LogbookCreatePage,
    LogbookEventDetailsPage,
    LogbookEventComponent,
    LogbookEventDetailsComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class LogbookModule { }
