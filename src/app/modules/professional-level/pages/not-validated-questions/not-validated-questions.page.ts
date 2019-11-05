import { Component, OnInit } from '@angular/core';

import { CursusOrderEnum } from '../../../../core/enums/cursus-order.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import { StageModel } from '../../../../core/models/professional-level/stage.model';

@Component({
  selector: 'not-validated-questions',
  templateUrl: 'not-validated-questions.page.html',
  styleUrls: ['./not-validated-questions.page.scss']
})
export class NotValidatedQuestionsPage implements OnInit {

  stage: StageModel;
  module: ModuleModel;
  pnc: PncModel;

  constructor() {
    this.stage = history.state.data.stage;
    this.module = history.state.data.module;
    this.pnc = history.state.data.pnc;
  }

  ngOnInit() {
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
