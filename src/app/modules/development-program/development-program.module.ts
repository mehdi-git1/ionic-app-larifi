import { CareerObjectiveModule } from './../career-objective/career-objective.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { EObservationModule } from '../eobservation/eobservation.module';
import {
    ProfessionalInterviewModule
} from '../professional-interview/professional-interview.module';
import { DevelopmentProgramPage } from './pages/development-program/development-program.page';


@NgModule({
  declarations: [
    DevelopmentProgramPage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    EObservationModule,
    ProfessionalInterviewModule,
    CareerObjectiveModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class DevelopmentProgramModule { }
