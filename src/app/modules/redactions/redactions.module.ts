import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { CareerObjectiveModule } from '../career-objective/career-objective.module';
import { EObservationModule } from '../eobservation/eobservation.module';
import {
    ProfessionalInterviewModule
} from '../professional-interview/professional-interview.module';
import { ExtraRedactionsComponent } from './components/extra-redactions/extra-redactions.page';
import { RedactionsPage } from './pages/redactions/redactions.page';

@NgModule({
  declarations: [
    RedactionsPage,
    ExtraRedactionsComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    EObservationModule,
    ProfessionalInterviewModule,
    CareerObjectiveModule
  ],
  entryComponents: [
    RedactionsPage
  ],
  exports: [
    RedactionsPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class RedactionsModule { }
