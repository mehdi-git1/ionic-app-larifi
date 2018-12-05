import { EvaluationModel } from './../../../models/professional-level/evaluation.model';
import { OfflineEvaluationSheetService } from './offline-evaluation-sheet.service';
import { OnlineEvaluationSheetService } from './online-evaluation-sheet.service';
import { OnlineEObservationService } from './../../e-observation/online-e-observation.service';
import { ProfessionalLevelModel } from './../../../models/professional-level/professional-level.model';
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
     * Récupère la fiche d'évaluation d'un module
     * @param moduleId l'id du module dont on souhaite récupérer la fiche d'évaluation
     * @return la fiche d'évaluation du module
     */
    getEvaluationSheet(moduleId: number): Promise<EvaluationModel[]> {
        return this.execFunctionService('getEvaluationSheet', moduleId);
    }

}
