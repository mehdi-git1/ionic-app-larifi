import { Entity } from '../../models/entity';
import { ProfessionalLevel } from '../../models/professionalLevel/professional-level';
import { StorageService } from '../../../../services/storage.service';
import { Injectable } from '@angular/core';
import { Stage } from '../../models/professionalLevel/stage';


@Injectable()
export class OfflineProfessionalLevelProvider {

    constructor(private storageService: StorageService) {
    }

    /**
     * Récupère le suivi réglementaire d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
     * @return le suivi réglementaire du PNC
     */
    getProfessionalLevel(matricule: string): Promise<ProfessionalLevel> {
        return this.storageService.findOneAsync(Entity.PROFESSIONAL_LEVEL, matricule);
    }
}
