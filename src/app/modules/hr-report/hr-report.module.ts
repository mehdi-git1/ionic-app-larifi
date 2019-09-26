import { LogbookPage } from './../logbook/pages/logbook/logbook.page';
import { HrReportPage } from './pages/hr-report/hr-report.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [
    HrReportPage,

  ],
  imports: [
    [IonicPageModule.forChild(HrReportPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    HrReportPage
  ],
  exports: [
    HrReportPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class HrReportModule { }
