import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {UpcomingFlightListPage} from './pages/upcoming-flight-list/upcoming-flight-list.page';
import {FlightCrewListPage} from './pages/flight-crew-list/flight-crew-list.page';
import {FlightCardComponent} from './components/flight-card/flight-card.component';
import {RotationCardComponent} from './components/rotation-card/rotation-card.component';


@NgModule({
  declarations: [
    UpcomingFlightListPage,
    FlightCrewListPage,
    FlightCardComponent,
    RotationCardComponent
  ],
  imports: [
    [IonicPageModule.forChild(UpcomingFlightListPage)],
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

export class FlightActivityModule{}
