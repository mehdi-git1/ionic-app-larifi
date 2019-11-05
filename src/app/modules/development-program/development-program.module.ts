import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { EObservationModule } from '../eobservation/eobservation.module';
import {
    ProfessionalInterviewModule
} from '../professional-interview/professional-interview.module';
import { CareerObjectiveComponent } from './components/career-objective/career-objective.component';
import {
    CareerObjectivesComponent
} from './components/career_objectives/career-objectives.component';
import {
    CareerObjectiveCreatePage
} from './pages/career-objective-create/career-objective-create.page';
import { CareerObjectiveListPage } from './pages/career-objective-list/career-objective-list.page';
import { WaypointCreatePage } from './pages/waypoint-create/waypoint-create.page';

@NgModule({
  declarations: [
    WaypointCreatePage,
    CareerObjectiveListPage,
    CareerObjectiveCreatePage,
    CareerObjectiveComponent,
    CareerObjectivesComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    EObservationModule,
    ProfessionalInterviewModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    WaypointCreatePage,
    CareerObjectiveCreatePage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class DevelopmentProgramModule { }
