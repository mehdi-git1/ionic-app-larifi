import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModuleTypeEnum } from '../../../../core/enums/module-type.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { StageModel } from '../../../../core/models/professional-level/stage.model';
import {
    ProfessionalLevelResultStatusUtil
} from '../../../../shared/utils/professional-level-result-status.util';

@Component({
  selector: 'module-card',
  templateUrl: 'module-card.component.html',
  styleUrls: ['./module-card.component.scss']
})
export class ModuleCardComponent {

  @Input() module: ModuleModel;

  @Input() stage: StageModel;

  @Input() pnc: PncModel;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  /**
   * Retourne la classe CSS associée au statut du module
   * @return la classe CSS du statut du module
   */
  getStatusCssClass(): string {
    return ProfessionalLevelResultStatusUtil.getStatusCssClass(this.module.moduleResultStatus);
  }

  /**
   * Redirige vers le détail d'un module. La feuille d'évaluation s'il s'agit d'un module pratique, ou la
   * liste des questions non validées s'il s'agit d'un module théorique
   * @param module le module dont on souhaite avoir le détail
   */
  goToModuleDetail(module: ModuleModel) {
    if (module.moduleType === ModuleTypeEnum.PRACTICAL) {
      this.router.navigate(['evaluation-sheet', module.techId], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['not-validated-question'], {
        relativeTo: this.activatedRoute,
        state: {
          data: {
            module: module,
            stage: this.stage,
            pnc: this.pnc
          }
        }
      });
    }
  }

  /**
   * Détermine si le détail d'un module est disponible (si on a des données à afficher dans le niveau 3)
   * @param module le module à tester
   * @return vrai si le détail du module est disponible, faux sinon
   */
  isModuleDetailAvailable(module: ModuleModel): boolean {
    if (module.moduleType === ModuleTypeEnum.THEORETICAL) {
      return module.cursus.length > 0;
    }
    return true;
  }
}
