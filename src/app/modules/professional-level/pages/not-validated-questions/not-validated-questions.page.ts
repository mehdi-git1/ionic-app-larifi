import { NavParams } from 'ionic-angular';

import { Component } from '@angular/core';

import { CursusOrderEnum } from '../../../../core/enums/cursus-order.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { StageModel } from '../../../../core/models/professional-level/stage.model';

@Component({
  selector: 'not-validated-questions',
  templateUrl: 'not-validated-questions.page.html',
})
export class NotValidatedQuestionsPage {

  stage: StageModel;
  module: ModuleModel;
  pnc: PncModel;

  constructor(private navParams: NavParams) {
    this.stage = this.navParams.get('stage');
    this.module = this.navParams.get('module');
    this.pnc = this.navParams.get('pnc');
  }

  ionViewDidLoad() {
    this.sortModuleCursus();
  }

  /**
   * Trie les parcours des modules dans l'ordre suivant : TVVC, TVT, TVT_R
   */
  sortModuleCursus() {
    this.module.cursus.sort((cursus1, cursus2) => {
      return CursusOrderEnum.getDisplayOrder(cursus1.orderNumber) > CursusOrderEnum.getDisplayOrder(cursus2.orderNumber) ? 1 : -1;
    });
  }

}
