import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { ProfessionalLevelModel } from '../../models/professional-level/professional-level.model';
import { StorageService } from '../../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class OfflineProfessionalLevelService {

    constructor(private storageService: StorageService) {
    }

    /**
     * Récupère le suivi réglementaire d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
     * @return le suivi réglementaire du PNC
     */
    getProfessionalLevel(matricule: string): Promise<ProfessionalLevelModel> {
        return this.storageService.findOneAsync(EntityEnum.PROFESSIONAL_LEVEL, matricule);
    }
}
