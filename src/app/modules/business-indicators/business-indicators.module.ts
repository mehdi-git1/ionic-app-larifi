import { ComponentsModule } from 'src/app/shared/components/components.module';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SharedModule } from '../../shared/shared.module';
import {
    BusinessIndicatorFlightLegendComponent
} from './components/business-indicator-flight-legend/business-indicator-flight-legend.component';
import {
    BusinessIndicatorPerfopsLegendComponent
} from './components/business-indicator-perfops-legend/business-indicator-perfops-legend.component';
import { EscoreChartComponent } from './components/escore-chart/escore-chart.component';
import {
    BusinessIndicatorDetailPage
} from './pages/business-indicator-detail/business-indicator-detail.page';
import { BusinessIndicatorsPage } from './pages/business-indicators/business-indicators.page';

@NgModule({
  declarations: [
    BusinessIndicatorsPage,
    BusinessIndicatorDetailPage,
    EscoreChartComponent,
    BusinessIndicatorFlightLegendComponent,
    BusinessIndicatorPerfopsLegendComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  entryComponents: [
    BusinessIndicatorsPage,
    BusinessIndicatorDetailPage,
    BusinessIndicatorFlightLegendComponent,
    BusinessIndicatorPerfopsLegendComponent
  ],
  exports: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class BusinessIndicatorsModule { }
