import { Component, Input, OnInit } from '@angular/core';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { StageModel } from '../../../../core/models/professional-level/stage.model';

@Component({
  selector: 'professional-level-stage',
  templateUrl: 'professional-level-stage.component.html'
})
export class ProfessionalLevelStageComponent {

  matPanelHeaderHeight = 'auto';

  _stages: StageModel[];

  @Input()
  set stages(stages: StageModel[]) {
    if (stages) {
      this._stages = stages;
    }
  }


  /**
   * Retourne la classe correspondant à la couleur du point en fonction du statut du module
   */
  getStageStatusPointCssClass(stage: StageModel): string {
    if ('SUCCESS' == stage.stageResultStatus) {
      return 'green-point';
    } else if ('SUCCESS_WITH_FC' == stage.stageResultStatus) {
      return 'yellow-point';
    } else if ('SUCCESS_WITH_FC_AND_TESTS' == stage.stageResultStatus) {
      return 'orange-point';
    } else if ('SUCCESS_WITH_RETAKE' == stage.stageResultStatus) {
      return 'orange-point';
    } else if ('FAILED' == stage.stageResultStatus) {
      return 'red-point';
    }
    return '';
  }
}
