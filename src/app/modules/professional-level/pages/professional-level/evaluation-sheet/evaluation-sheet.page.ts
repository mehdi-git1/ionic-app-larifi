import { NavParams } from 'ionic-angular';

import { Component } from '@angular/core';

import { PncModel } from '../../../../../core/models/pnc.model';
import {
    EvaluationSheetModel
} from '../../../../../core/models/professional-level/evaluation-sheet.model';
import { ModuleModel } from '../../../../../core/models/professional-level/module.model';
import { PncService } from '../../../../../core/services/pnc/pnc.service';
import {
    EvaluationSheetService
} from '../../../../../core/services/professional-level/evaluation-sheet/evaluation-sheet.service';
import { SessionService } from '../../../../../core/services/session/session.service';
import {
    ProfessionalLevelResultStatusUtil
} from '../../../../../shared/utils/professional-level-result-status.util';

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

    loadData() {
        this.matricule = this.sessionService.getActiveUser().matricule;
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
        this.moduleId = this.navParams.get('moduleId');
        if (this.moduleId) {
            this.evaluationSheetService.getEvaluationSheet(this.matricule, this.moduleId).then(evaluationSheet => {
                this.evaluationSheet = evaluationSheet;
            }, error => { });
        } else {
            this.evaluationSheet = new EvaluationSheetModel();
        }
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return typeof this.evaluationSheet !== 'undefined';
    }

    /**
     * Retourne la classe CSS associée au statut du module
     * @param module le module dont on souhaite récupérer la classe CSS du statut
     * @return la classe CSS du statut du module
     */
    getStatusCssClass(module: ModuleModel): string {
        return ProfessionalLevelResultStatusUtil.getStatusCssClass(module.moduleResultStatus);
    }
}

