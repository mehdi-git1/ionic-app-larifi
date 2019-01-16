import { PncModel } from './../../../../core/models/pnc.model';
import { ProfessionalLevelResultStatusUtil } from './../../../../shared/utils/professional-level-result-status.util';
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

  @Input() pnc: PncModel;

  @Input()
  set stages(stages: StageModel[]) {
    if (stages) {
      for (const stage of stages) {
        if (stage && stage.modules) {
          stage.modules = stage.modules.sort((module: ModuleModel, otherModule: ModuleModel) => {
            return module.date > otherModule.date ? 1 : -1;
          });
        }
      }
      this._stages = stages;
    }
  }


  /**
   * Retourne la classe CSS associée au statut du stage
   * @param stage le stage dont on souhaite récupérer la classe CSS de son statut
   * @return la classe CSS du statut du stage
   */
  getStatusCssClass(stage: StageModel): string {
    return ProfessionalLevelResultStatusUtil.getStatusCssClass(stage.stageResultStatus);
  }
}
