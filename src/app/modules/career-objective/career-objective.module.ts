import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { EObservationModule } from '../eobservation/eobservation.module';
import {
    ProfessionalInterviewModule
} from '../professional-interview/professional-interview.module';
import {
    CareerObjectiveListComponent
} from './components/career-objective-list/career-objective-list.component';
import { CareerObjectiveComponent } from './components/career-objective/career-objective.component';
import {
    CareerObjectivesComponent
} from './components/career_objectives/career-objectives.component';
import {
    CareerObjectiveCreatePage
} from './pages/career-objective-create/career-objective-create.page';
import { WaypointCreatePage } from './pages/waypoint-create/waypoint-create.page';

@NgModule({
  declarations: [
    WaypointCreatePage,
    CareerObjectiveListComponent,
    CareerObjectiveCreatePage,
    CareerObjectiveComponent,
    CareerObjectivesComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    WaypointCreatePage,
    CareerObjectiveCreatePage,
    CareerObjectiveListComponent
  ],
  exports: [
    CareerObjectiveListComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class CareerObjectiveModule { }
