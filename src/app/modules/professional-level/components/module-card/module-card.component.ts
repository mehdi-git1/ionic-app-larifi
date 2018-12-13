import { Component, Input } from '@angular/core';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { TranslateService } from '@ngx-translate/core';
import { TranslateOrEmptyService } from '../../../../core/services/translate/translate-or-empty.service';

@Component({
  selector: 'module-card',
  templateUrl: 'module-card.component.html'
})
export class ModuleCardComponent {

  @Input() module: ModuleModel;

  constructor(public translateOrEmptyService: TranslateOrEmptyService) {
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

  translateType(): string {
    if (this.module && this.module.moduleType && this.module.moduleType !== undefined) {
      return this.translateOrEmptyService.translateConcatenateKey('PROFESSIONAL_LEVEL.MODULE_TYPE.', this.module.moduleType);
    }
    return '';
  }

  translateStatus(): string {
    if (this.module && this.module.moduleResultStatus && this.module.moduleResultStatus !== undefined) {
      return this.translateOrEmptyService.translateConcatenateKey('PROFESSIONAL_LEVEL.MODULE_STATUS.', this.module.moduleResultStatus);
    }
    return '';
  }
}
