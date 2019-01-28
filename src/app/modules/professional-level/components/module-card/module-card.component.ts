import { ModuleTypeEnum } from './../../../../core/enums/module-type.enum';
import { NotValidatedQuestionsPage } from './../../pages/not-validated-questions/not-validated-questions.page';
import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { EvaluationSheetPage } from '../../pages/professional-level/evaluation-sheet/evaluation-sheet.page';
import { StageModel } from '../../../../core/models/professional-level/stage.model';
import { ProfessionalLevelResultStatusUtil } from '../../../../shared/utils/professional-level-result-status.util';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
  selector: 'module-card',
  templateUrl: 'module-card.component.html'
})
export class ModuleCardComponent {

  @Input() module: ModuleModel;

  @Input() stage: StageModel;

  @Input() pnc: PncModel;

  constructor(private navCtrl: NavController) {
  }

  /**
   * Retourne la classe CSS associée au statut du module
   * @return la classe CSS du statut du module
   */
  getStatusCssClass(): string {
    return ProfessionalLevelResultStatusUtil.getStatusCssClass(this.module.moduleResultStatus);
  }

  /**
   * Redirige vers le détail d'un module. La feuille d'évaluation s'il s'agit d'un module pratique, ou la liste des questions non validées s'il s'agit d'un module théorique
   * @param module le module dont on souhaite avoir le détail
   */
  goToModuleDetail(module: ModuleModel) {
    if (module.moduleType == ModuleTypeEnum.PRACTICAL) {
      this.navCtrl.push(EvaluationSheetPage, { matricule: this.pnc.matricule, moduleId: module.techId });
    } else {
      this.navCtrl.push(NotValidatedQuestionsPage, { module: module, stage: this.stage, pnc: this.pnc });
    }
  }

  /**
   * Détermine si le détail d'un module est disponible (si on a des données à afficher dans le niveau 3)
   * @param module le module à tester
   * @return vrai si le détail du module est disponible, faux sinon
   */
  isModuleDetailAvailable(module: ModuleModel): boolean {
    if (module.moduleType == ModuleTypeEnum.THEORETICAL) {
      return module.cursus.length > 0;
    }
    return true;
  }
}
