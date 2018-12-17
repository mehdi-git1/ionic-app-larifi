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

    evaluationSheet: EvaluationSheetModel;
    module: ModuleModel;

    constructor(
        private navParams: NavParams,
        private evaluationSheetService: EvaluationSheetService
    ) {
    }

    ionViewDidEnter() {
        this.loadData();
    }

    /**
     * Retourne la classe css du statut correspondant
     */
    getCssClassForModuleStatus(moduleResultStatus): string {
        this.module = this.navParams.get('module');
        if (moduleResultStatus === 'SUCCESS') {
            return 'success';
        } else if (moduleResultStatus === 'SUCCESS_WITH_FC') {
            return 'notbad';
        } else if (moduleResultStatus === 'FAILED') {
            return 'failure';
        }
    }

    loadData() {
        this.module = this.navParams.get('module');
        if (this.module) {
            this.evaluationSheetService.getEvaluationSheet(this.module.techId).then(evaluationSheet => {
                this.evaluationSheet = evaluationSheet;
            }, error => { });
        }
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return typeof this.evaluationSheet !== 'undefined';
    }
}

