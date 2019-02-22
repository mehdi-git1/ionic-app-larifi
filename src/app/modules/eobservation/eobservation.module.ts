import { AbnormalLevelComponent } from './components/abnormal-level/abnormal-level.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { EObservationComponent } from './components/e-observation/e-observation.component';
import { EObservationsComponent } from './components/e-observations/e-observations.component';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { EobservationDetailsPage } from './pages/eobservation-details/eobservation-details';
import { ColorNumberDotComponent } from './components/color-number-dot/color-number-dot';
import { QuestionSymbolComponent } from './components/question-symbol/question-symbol';



@NgModule({
  declarations: [
    EObservationsComponent,
    EObservationComponent,
    AbnormalLevelComponent,
    ColorNumberDotComponent,
    QuestionSymbolComponent,
    EobservationDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(EobservationDetailsPage),
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    EobservationDetailsPage
  ],
  exports: [
    EObservationComponent,
    EObservationsComponent,
    AbnormalLevelComponent,
    ColorNumberDotComponent,
    QuestionSymbolComponent,
    EobservationDetailsPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class EObservationModule { }
