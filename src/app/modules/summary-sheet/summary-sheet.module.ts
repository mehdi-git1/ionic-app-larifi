import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {SummarySheetPage} from './pages/summary-sheet/summary-sheet.page';


@NgModule({
  declarations: [
    SummarySheetPage
  ],
  imports: [
    [IonicPageModule.forChild(SummarySheetPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    SummarySheetPage
  ],
  exports: [
    SummarySheetPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class SummarySheetModule{}
