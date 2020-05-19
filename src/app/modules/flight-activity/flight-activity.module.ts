import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { FlightCardComponent } from './components/flight-card/flight-card.component';
import { RotationListComponent } from './components/rotation-list/rotation-list.component';
import { FlightCrewListPage } from './pages/flight-crew-list/flight-crew-list.page';
import { UpcomingFlightListPage } from './pages/upcoming-flight-list/upcoming-flight-list.page';

@NgModule({
  declarations: [
    UpcomingFlightListPage,
    FlightCrewListPage,
    FlightCardComponent,
    RotationListComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    UpcomingFlightListPage,
    FlightCrewListPage
  ],
  exports: [
    UpcomingFlightListPage,
    FlightCrewListPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class FlightActivityModule { }
