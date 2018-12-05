import { ModuleModel } from './../../../../../core/models/professional-level/module.model';
import { EvaluationSheetService } from './../../../../../core/services/professional-level/evaluation-sheet/evaluation-sheet.service';
import { EvaluationSheetModel } from './../../../../../core/models/professional-level/evaluation-sheet.model';
import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
    selector: 'page-evaluation-sheet',
    templateUrl: 'evaluation-sheet.page.html',
})

export class EvaluationSheetPage {

    evaluationSheetModel: EvaluationSheetModel;
    module: ModuleModel;
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
        this.module = this.navParams.get('module');
        if (this.module) {
            this.evaluationSheetService.getEvaluationSheet(this.module.techId).then(evaluations => {
                this.evaluationSheetModel = new EvaluationSheetModel();
                evaluations.forEach(evaluation => {
                    this.evaluationSheetModel.module = evaluation.module;
                    if (evaluation.type === 'E1') {
                        this.evaluationSheetModel.evaluationE1 = evaluation;
                        this.evaluationSheetModel.evaluationComment = evaluation.comment;
                    } else if (evaluation.type === 'E2') {
                        this.evaluationSheetModel.evaluationE2 = evaluation;
                        this.evaluationSheetModel.evaluationComment = evaluation.comment;
                    } else if (evaluation.type === 'FC') {
                        this.evaluationSheetModel.fc = evaluation;
                    }
                });
                this.loading = false;
            }, error => { });
        }
    }
}

