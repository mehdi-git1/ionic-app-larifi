import { EvaluationSheetModel } from './../../../models/professional-level/evaluation-sheet.model';
import { OfflineEvaluationSheetService } from './offline-evaluation-sheet.service';
import { OnlineEvaluationSheetService } from './online-evaluation-sheet.service';
import { ConnectivityService } from './../../connectivity/connectivity.service';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';



@Injectable()
export class EvaluationSheetService extends BaseService {

    constructor(
        public connectivityService: ConnectivityService,
        private onlineEvaluationSheetService: OnlineEvaluationSheetService,
        private offlineEvaluationSheetService: OfflineEvaluationSheetService) {
        super(
            connectivityService,
            onlineEvaluationSheetService,
            offlineEvaluationSheetService
        );
    }

    /**
     * Récupère la fiche d'évaluation d'un module du pnc observé
     * @param matricule le matricule du pnc observé
     * @param moduleId l'id du module dont on souhaite récupérer la feuille d'évaluation
     * @return la fiche d'évaluation du module
     */
    getEvaluationSheet(matricule: string, moduleId: number): Promise<EvaluationSheetModel> {
        return this.execFunctionService('getEvaluationSheet', matricule, moduleId);
    }

}
