import { EvaluationSheetModel } from './../../../models/professional-level/evaluation-sheet.model';
import { EntityEnum } from './../../../enums/entity.enum';
import { StorageService } from './../../../storage/storage.service';
import { Injectable } from '@angular/core';
import { ProfessionalLevelModel } from '../../../models/professional-level/professional-level.model';


@Injectable()
export class OfflineEvaluationSheetService {

    constructor(private storageService: StorageService) {
    }

    /**
     * Récupère la fiche d'évaluation d'un module
     * @param matricule le matricule du pnc
     * @param moduleId l'id du module dont on souhaite récupérer la fiche d'évaluation
     * @return la fiche d'évaluation du module
     */
    getEvaluationSheet(matricule: string, moduleId: number): Promise<EvaluationSheetModel> {
        return this.storageService.findOneAsync(EntityEnum.PROFESSIONAL_LEVEL, matricule).then(result => {
            return result.evaluationSheets[moduleId];
        });
    }

}
