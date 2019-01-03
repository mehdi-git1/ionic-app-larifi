import { ModuleTypeEnum } from './../../../../core/enums/module-type.enum';
import { NotValidatedQuestionsPage } from './../../pages/not-validated-questions/not-validated-questions.page';
import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { EvaluationSheetPage } from '../../pages/professional-level/evaluation-sheet/evaluation-sheet.page';
import { StageModel } from '../../../../core/models/professional-level/stage.model';

@Component({
  selector: 'module-card',
  templateUrl: 'module-card.component.html'
})
export class ModuleCardComponent {

  @Input() module: ModuleModel;

  @Input() stage: StageModel;

  @Input() matricule: string;

  constructor(private navCtrl: NavController) {
  }

  /**
   * Retourne la classe correspondant à la couleur du point en fonction du statut du module
   */
  getModuleStatusPointCssClass(): string {
    if ('SUCCESS' == this.module.moduleResultStatus) {
      return 'green-point';
    } else if ('SUCCESS_WITH_FC' == this.module.moduleResultStatus) {
      return 'yellow-point';
    } else if ('SUCCESS_WITH_FC_AND_TESTS' == this.module.moduleResultStatus) {
      return 'orange-point';
    } else if ('SUCCESS_WITH_RETAKE' == this.module.moduleResultStatus) {
      return 'orange-point';
    } else if ('FAILED' == this.module.moduleResultStatus) {
      return 'red-point';
    }
    return '';
  }

  /**
   * Redirige vers le détail d'un module. La feuille d'évaluation s'il s'agit d'un module pratique, ou la liste des questions non validées s'il s'agit d'un module théorique
   * @param module le module dont on souhaite avoir le détail
   */
  goToModuleDetail(module: ModuleModel) {
    if (module.moduleType == ModuleTypeEnum.PRACTICAL) {
      this.navCtrl.push(EvaluationSheetPage, { matricule: this.matricule, moduleId: module.techId });
    } else {
      this.navCtrl.push(NotValidatedQuestionsPage, { module: module, stage: this.stage });
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
