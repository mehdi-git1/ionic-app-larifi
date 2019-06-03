import { LogbookEventDetailsComponent } from './components/logbook-event-details/logbook-event-details.component';
import { LogbookEventDetailsPage } from './pages/logbook-event-details/logbook-event-details.page';
import { LogbookEditPage } from './pages/logbook-edit/logbook-edit.page';
import { LogbookPage } from './pages/logbook/logbook.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [
    LogbookPage,
    LogbookEditPage,
    LogbookEventDetailsPage,
    LogbookEventDetailsComponent
  ],
  imports: [
    [IonicPageModule.forChild(LogbookPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    LogbookPage,
    LogbookEditPage,
    LogbookEventDetailsPage,
    LogbookEventDetailsComponent
  ],
  exports: [
    LogbookPage,
    LogbookEditPage,
    LogbookEventDetailsPage,
    LogbookEventDetailsComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class LogbookModule { }
