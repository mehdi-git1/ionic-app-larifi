import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { AbnormalLevelComponent } from './components/abnormal-level/abnormal-level.component';
import { ColorNumberDotComponent } from './components/color-number-dot/color-number-dot.component';
import { EObservationComponent } from './components/e-observation/e-observation.component';
import { EObservationsComponent } from './components/e-observations/e-observations.component';
import {
    EObsAppreciationComponent
} from './components/eobs-appreciation/eobs-appreciation.component';
import {
    EObsBilanFlightComponent
} from './components/eobs-bilan-flight/eobs-bilan-flight.component';
import { EObsCommentComponent } from './components/eobs-comment/eobs-comment.component';
import {
    EobsItemDescriptionComponent
} from './components/eobs-item-description/eobs-item-description.component';
import {
    EObsRotationInfoComponent
} from './components/eobs-rotation-info/eobs-rotation-info.component';
import { EObsStateComponent } from './components/eobs-state/eobs-state.component';
import {
    EObsTemporaryPeriodComponent
} from './components/eobs-temporary-period/eobs-temporary-period.component';
import { EObsThemeComponent } from './components/eobs-theme/eobs-theme.component';
import { ExitSymbolComponent } from './components/exit-symbol/exit-symbol.component';
import { QuestionSymbolComponent } from './components/question-symbol/question-symbol.component';
import { EobservationDetailsPage } from './pages/eobservation-details/eobservation-details.page';
import {
    EObservationsArchivesPage
} from './pages/eobservations-archives/eobservations-archives.page';

@NgModule({
  declarations: [
    EObservationsComponent,
    EObservationComponent,
    AbnormalLevelComponent,
    ColorNumberDotComponent,
    QuestionSymbolComponent,
    ExitSymbolComponent,
    EObsTemporaryPeriodComponent,
    EObsBilanFlightComponent,
    EObsRotationInfoComponent,
    EObsCommentComponent,
    EObsStateComponent,
    EObsThemeComponent,
    EObsAppreciationComponent,
    EobsItemDescriptionComponent,
    EobservationDetailsPage,
    EObservationsArchivesPage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule
  ],
  entryComponents: [
    EobservationDetailsPage,
    EobsItemDescriptionComponent,
    EObservationsArchivesPage
  ],
  exports: [
    EObservationComponent,
    EObservationsComponent,
    AbnormalLevelComponent,
    ColorNumberDotComponent,
    QuestionSymbolComponent,
    ExitSymbolComponent,
    EObsTemporaryPeriodComponent,
    EObsBilanFlightComponent,
    EObsRotationInfoComponent,
    EObsCommentComponent,
    EObsStateComponent,
    EObsThemeComponent,
    EObsAppreciationComponent,
    EobsItemDescriptionComponent,
    EobservationDetailsPage,
    EObservationsArchivesPage

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class EObservationModule { }
