import { LogbookEventDetailsPage } from './pages/logbook-event-details/logbook-event-details.page';
import { LogbookEventComponent } from './components/logbook-event/logbook-event.component';
import { LogbookEventActionMenuComponent } from './components/logbook-event-action-menu/logbook-event-action-menu.component';
import { LogbookCreatePage } from './pages/logbook-create/logbook-create.page';
import { LogbookPage } from './pages/logbook/logbook.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [
    LogbookPage,
    LogbookCreatePage,
    LogbookEventDetailsPage,
    LogbookEventComponent,
    LogbookEventActionMenuComponent
  ],
  imports: [
    [IonicPageModule.forChild(LogbookPage)],
    SharedModule,
    ComponentsModule
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
