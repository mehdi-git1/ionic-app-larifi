import { EvaluationSheetModel } from './../../../models/professional-level/evaluation-sheet.model';
import { ProfessionalLevelModel } from './../../../models/professional-level/professional-level.model';
import { Injectable } from '@angular/core';
import { RestService } from '../../../http/rest/rest.base.service';
import { Config } from '../../../../../environments/config';

@Injectable()
export class OnlineEvaluationSheetService {

    constructor(public restService: RestService,
        public config: Config) {
    }

    /**
     * Récupère la fiche d'évaluation d'un module
     * @param moduleId l'id du module dont on souhaite récupérer la fiche d'évaluation
     * @return la fiche d'évaluation du module
     */

    getEvaluationSheet(moduleId: number): Promise<any> {
        return this.restService.get(`${this.config.backEndUrl}evaluations/${moduleId}`);
    }
}
