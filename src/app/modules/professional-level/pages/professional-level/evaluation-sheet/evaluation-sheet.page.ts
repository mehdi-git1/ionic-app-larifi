import { PncService } from './../../../../../core/services/pnc/pnc.service';
import { PncModel } from './../../../../../core/models/pnc.model';
import { SessionService } from './../../../../../core/services/session/session.service';
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
    moduleId: number;
    matricule: string;
    pnc: PncModel;

    constructor(
        private navParams: NavParams,
        private evaluationSheetService: EvaluationSheetService,
        private sessionService: SessionService,
        private pncService: PncService) {
    }

    ionViewDidEnter() {
        this.loadData();
    }

    /**
     * Retourne la classe css du statut correspondant
     */
    getCssClassForModuleStatus(moduleResultStatus): string {
        if (moduleResultStatus === 'SUCCESS') {
            return 'success';
        } else if (moduleResultStatus === 'SUCCESS_WITH_FC') {
            return 'successWithFC';
        } else if (moduleResultStatus === 'FAILED') {
            return 'failed';
        }
    }

    loadData() {
        if (this.navParams.get('matricule')) {
            this.matricule = this.navParams.get('matricule');
        } else if (this.sessionService.getActiveUser()) {
            this.matricule = this.sessionService.getActiveUser().matricule;
        }
        if (this.matricule) {
            this.pncService.getPnc(this.matricule).then(pnc => {
                this.pnc = pnc;
            }, error => { });
            this.moduleId = this.navParams.get('moduleId');
            if (this.moduleId) {
                this.evaluationSheetService.getEvaluationSheet(this.matricule, this.moduleId).then(evaluationSheet => {
                    this.evaluationSheet = evaluationSheet;
                }, error => { });
            }
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

