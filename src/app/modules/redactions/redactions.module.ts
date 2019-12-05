import { CareerObjectiveModule } from './../career-objective/career-objective.module';
import { ProfessionalInterviewModule } from './../professional-interview/professional-interview.module';
import { EObservationModule } from './../eobservation/eobservation.module';
import { RedactionsPage } from './pages/redactions.page';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { Config } from '../../../environments/config';
import { AppVersionService } from '../../core/services/app-version/app-version.service';
import { VersionService } from '../../core/services/version/version.service';
import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    RedactionsPage
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
