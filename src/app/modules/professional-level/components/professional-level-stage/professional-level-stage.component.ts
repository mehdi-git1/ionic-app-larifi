import { Component, Input } from '@angular/core';

import { PncModel } from '../../../../core/models/pnc.model';
import { StageModel } from '../../../../core/models/professional-level/stage.model';
import {
    ProfessionalLevelResultStatusUtil
} from '../../../../shared/utils/professional-level-result-status.util';

@Component({
  selector: 'professional-level-stage',
  templateUrl: 'professional-level-stage.component.html',
  styleUrls: ['./professional-level-stage.component.scss']
})
export class ProfessionalLevelStageComponent {

  _stages: StageModel[];

  @Input() pnc: PncModel;

  @Input()
  set stages(stages: StageModel[]) {
    if (stages) {
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
