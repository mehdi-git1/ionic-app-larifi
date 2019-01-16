import { ModuleModel } from './../../../../core/models/professional-level/module.model';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { StageModel } from '../../../../core/models/professional-level/stage.model';
import { PncModel } from '../../../../core/models/pnc.model';

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
  }
}
