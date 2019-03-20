import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { OfflineActionEnum } from '../../enums/offline-action.enum';
import { ProfessionalAssessmentModel } from '../../models/professional-assessment/professional-assessment.model';

@Injectable()
export class OfflineProfessionalAssessementService {

    constructor(
        private storageService: StorageService
    ) {
    }

    /**
     * Sauvegarde un bilan professionel dans le cache
     * @param professionalAssessment le bilan professionel à sauvegarder
     * @return une promesse contenant le bilan professionel sauvé
     */
    save(professionalAssessment: ProfessionalAssessmentModel): Promise<ProfessionalAssessmentModel[]> {
        return this.storageService.saveAsync(EntityEnum.PROFESSIONAL_ASSESSMENT, professionalAssessment);
    }

    /**
     * Récupère les bilans professionel d'un PNC du cache à partir de son matricule
     * @param matricule le matricule du PNC
     * @return une promesse contenant les bilans professionel trouvées
     */
    getEObservations(matricule: string): Promise<ProfessionalAssessmentModel[]> {
        return new Promise((resolve, reject) => {
            const professionalAssessmentList = this.storageService.findAll(EntityEnum.PROFESSIONAL_ASSESSMENT);
            const professionalAssessments = professionalAssessmentList.filter(professionalAssessment => {
                return professionalAssessment.pnc.matricule === matricule && professionalAssessment.offlineAction !== OfflineActionEnum.DELETE;
            });
            resolve(professionalAssessments);
        });
    }

}
