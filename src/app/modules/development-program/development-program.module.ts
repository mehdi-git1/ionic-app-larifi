import { CareerObjectivesComponent } from './components/career_objectives/career-objectives.component';
import { EObservationModule } from './../eobservation/eobservation.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { WaypointCreatePage } from './pages/waypoint-create/waypoint-create.page';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { CareerObjectiveListPage } from './pages/career-objective-list/career-objective-list.page';
import { CareerObjectiveCreatePage } from './pages/career-objective-create/career-objective-create.page';
import { CareerObjectiveComponent } from './components/career-objective/career-objective.component';
import { ProfessionalInterviewsComponent } from './components/professional_interviews/professional_interviews.component';
import { ProfessionalInterviewComponent } from './components/professional_interview/professional_interview.component';

@NgModule({
  declarations: [
    WaypointCreatePage,
    CareerObjectiveListPage,
    CareerObjectiveCreatePage,
    CareerObjectiveComponent,
    CareerObjectivesComponent,
    ProfessionalInterviewComponent,
    ProfessionalInterviewsComponent
  ],
  imports: [
    [IonicPageModule.forChild(CareerObjectiveListPage)],
    SharedModule,
    ComponentsModule,
    EObservationModule
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
