import { ComponentsModule } from 'src/app/shared/components/components.module';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SharedModule } from '../../shared/shared.module';
import {
    BusinessIndicatorCommentVerbatimComponent
} from './components/business-indicator-comment-verbatim/business-indicator-comment-verbatim.component';
import {
    BusinessIndicatorComparisonTableComponent
} from './components/business-indicator-comparison-table/business-indicator-comparison-table.component';
import {
    BusinessIndicatorFilterComponent
} from './components/business-indicator-filter/business-indicator-filter.component';
import {
    BusinessIndicatorFlightLegendComponent
} from './components/business-indicator-flight-legend/business-indicator-flight-legend.component';
import {
    BusinessIndicatorPerfopsLegendComponent
} from './components/business-indicator-perfops-legend/business-indicator-perfops-legend.component';
import {
    BusinessIndicatorSummaryDisplayComponent
} from './components/business-indicator-summary-display/business-indicator-summary-display.component';
import {
    BusinessIndicatorSummaryComponent
} from './components/business-indicator-summary/business-indicator-summary.component';
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
    BusinessIndicatorPerfopsLegendComponent,
    BusinessIndicatorCommentVerbatimComponent,
    BusinessIndicatorSummaryComponent,
    BusinessIndicatorFilterComponent,
    BusinessIndicatorComparisonTableComponent,
    BusinessIndicatorSummaryDisplayComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  exports: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    ScreenOrientation
  ]
})

export class BusinessIndicatorsModule { }
