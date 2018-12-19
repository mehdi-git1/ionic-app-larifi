import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { EvaluationSheetPage } from '../../pages/professional-level/evaluation-sheet/evaluation-sheet.page';
import { TranslateOrEmptyService } from '../../../../core/services/translate/translate-or-empty.service';

@Component({
  selector: 'module-card',
  templateUrl: 'module-card.component.html'
})
export class ModuleCardComponent {

  @Input() module: ModuleModel;

  @Input() matricule: string;

  constructor(private navCtrl: NavController,
    private translateOrEmptyService: TranslateOrEmptyService) {
  }

  /**
   * Retourne la classe correspondant à la couleur du point en fonction du statut du module
   */
  getModuleStatusPointCssClass(): string {
    if ('SUCCESS' == this.module.moduleResultStatus) {
      return 'green-point';
    } else if ('SUCCESS_WITH_FC' == this.module.moduleResultStatus) {
      return 'orange-point';
    } else if ('FAILED' == this.module.moduleResultStatus) {
      return 'red-point';
    }
    return '';
  }

  goToEvaluationSheetPage(matricule: string, moduleId: number) {
    this.navCtrl.push(EvaluationSheetPage, { matricule: matricule, moduleId: moduleId });
  }
}
