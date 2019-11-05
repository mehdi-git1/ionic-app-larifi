import { Injectable } from '@angular/core';

import { EntityEnum } from '../../../enums/entity.enum';
import { EvaluationSheetModel } from '../../../models/professional-level/evaluation-sheet.model';
import { StorageService } from '../../../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class OfflineEvaluationSheetService {

    constructor(private storageService: StorageService) {
    }

    /**
     * Récupère la fiche d'évaluation d'un module d'un pnc
     * @param matricule le matricule du pnc observé
     * @param moduleId l'id du module dont on souhaite récupérer la feuille d'évaluation
     * @return la fiche d'évaluation du module
     */
    getEvaluationSheet(matricule: string, moduleId: number): Promise<EvaluationSheetModel> {
        return this.storageService.findOneAsync(EntityEnum.PROFESSIONAL_LEVEL, matricule).then(result => {
            return result.evaluationSheets.filter(evaluationSheet => evaluationSheet.module.techId === moduleId)[0];
        });
    }

}
