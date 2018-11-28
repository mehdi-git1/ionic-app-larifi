import { EvaluationSheetService } from './../../../../../core/services/professional-level/evaluation-sheet/evaluation-sheet.service';
import { EvaluationSheetModel } from './../../../../../core/models/professional-level/evaluation-sheet.model';
import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
    selector: 'page-statutory-reporting-practical-module',
    templateUrl: 'practical-module.html',
})

export class EvaluationSheetPage {

    evaluationSheetModel: EvaluationSheetModel;
    loading: boolean;

    constructor(
        private navParams: NavParams,
        private evaluationSheetService: EvaluationSheetService
    ) {
        this.loading = true;
    }

    ionViewDidEnter() {
        this.loadData();
    }

    loadData() {
        /*  if (this.navParams.get('module')) {
      this.statutoryReportingProvider.getPracticalEvaluationSheet(this.navParams.get('module')).then(PracticalModuleData => {
            this.moduleData = PracticalModuleData;
            this.loading = false;
      }, error => { });
  };
*/
        this.evaluationSheetService.getEvaluationSheet('').then(EvaluationSheetData => {
            this.evaluationSheetModel = EvaluationSheetData;
            this.loading = false;
        }, error => { });
    }

}
