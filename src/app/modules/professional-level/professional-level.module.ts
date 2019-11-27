import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { EObservationModule } from '../eobservation/eobservation.module';
import { ModuleCardComponent } from './components/module-card/module-card.component';
import {
    ProfessionalLevelCursusComponent
} from './components/professional-level-cursus/professional-level-cursus.component';
import {
    ProfessionalLevelStageComponent
} from './components/professional-level-stage/professional-level-stage.component';
import { StageLegendComponent } from './components/stage-legend/stage-legend.component';
import {
    NotValidatedQuestionsPage
} from './pages/not-validated-questions/not-validated-questions.page';
import {
    EvaluationSheetPage
} from './pages/professional-level/evaluation-sheet/evaluation-sheet.page';
import { ProfessionalLevelPage } from './pages/professional-level/professional-level.page';

@NgModule({
  declarations: [
    ProfessionalLevelPage,
    EvaluationSheetPage,
    NotValidatedQuestionsPage,
    ModuleCardComponent,
    ProfessionalLevelStageComponent,
    ProfessionalLevelCursusComponent,
    StageLegendComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    EObservationModule
  ],
  entryComponents: [
    ProfessionalLevelPage,
    EvaluationSheetPage,
    NotValidatedQuestionsPage,
    StageLegendComponent
  ],
  exports: [
    ProfessionalLevelPage,
    EvaluationSheetPage,
    NotValidatedQuestionsPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class ProfessionalLevelModule { }
