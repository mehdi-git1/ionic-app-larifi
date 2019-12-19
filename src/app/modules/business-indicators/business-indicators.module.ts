import { FlightDetailsCardPage } from './pages/flight-details-card/flight-details-card.page';
import { BusinessIndicatorsPage } from './pages/business-indicators/business-indicators.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      BusinessIndicatorsPage,
      FlightDetailsCardPage
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
      FlightDetailsCardPage
    ],
    exports: [],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: []
  })

  export class BusinessIndicatorsModule {}
