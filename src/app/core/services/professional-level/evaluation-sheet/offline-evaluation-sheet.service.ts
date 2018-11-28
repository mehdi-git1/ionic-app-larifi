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
     * Récupère le niveau pro d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
     * @return le suivi réglementaire du PNC
     */
    getProfessionalLevel(matricule: string): Promise<ProfessionalLevelModel> {
        return this.storageService.findOneAsync(EntityEnum.PROFESSIONAL_LEVEL, matricule);
    }

    getEvaluationSheet(module: string): Promise<EvaluationSheetModel> {
        return this.storageService.findOneAsync(EntityEnum.PROFESSIONAL_LEVEL, module).then(result => {
            return result;
        });
    }

}
