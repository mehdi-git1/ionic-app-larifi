import { ComponentsModule } from 'src/app/shared/components/components.module';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';
import {
    BusinessIndicatorDetailPage
} from './pages/business-indicator-detail/business-indicator-detail.page';
import { BusinessIndicatorsPage } from './pages/business-indicators/business-indicators.page';

@NgModule({
  declarations: [
    BusinessIndicatorsPage,
    BusinessIndicatorDetailPage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    BusinessIndicatorsPage,
    BusinessIndicatorDetailPage
  ],
  exports: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class BusinessIndicatorsModule { }
