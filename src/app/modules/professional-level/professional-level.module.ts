import { ProfessionalLevelCursusComponent } from './components/professional-level-cursus/professional-level-cursus.component';
import { EvaluationSheetPage } from './pages/professional-level/evaluation-sheet/evaluation-sheet.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { ProfessionalLevelPage } from './pages/professional-level/professional-level.page';
import { ModuleCardComponent } from './components/module-card/module-card.component';
import { ProfessionalLevelStageComponent } from './components/professional-level-stage/professional-level-stage.component';
import { NotValidatedQuestionsPage } from './pages/not-validated-questions/not-validated-questions.page';


@NgModule({
  declarations: [
    ProfessionalLevelPage,
    EvaluationSheetPage,
    NotValidatedQuestionsPage,
    ModuleCardComponent,
    ProfessionalLevelStageComponent,
    ProfessionalLevelCursusComponent
  ],
  imports: [
    [IonicPageModule.forChild(ProfessionalLevelPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    ProfessionalLevelPage,
    EvaluationSheetPage,
    NotValidatedQuestionsPage
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
