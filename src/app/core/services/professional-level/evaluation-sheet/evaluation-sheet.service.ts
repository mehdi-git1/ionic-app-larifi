import { OfflineEvaluationSheetService } from './offline-evaluation-sheet.service';
import { OnlineEvaluationSheetService } from './online-evaluation-sheet.service';
import { OnlineEObservationService } from './../../e-observation/online-e-observation.service';
import { EvaluationSheetModel } from './../../../models/professional-level/evaluation-sheet.model';
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
     * Récupère le niveau pro SV d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le niveau pro SV
     * @return le niveau pro SV du PNC
     */
    getProfessionalLevel(matricule: string): Promise<ProfessionalLevelModel> {
        return this.execFunctionService('getProfessionalLevel', matricule);
    }

    getEvaluationSheet(module: string): Promise<EvaluationSheetModel> {
        return this.execFunctionService('getEvaluationSheet', module);
    }

}
