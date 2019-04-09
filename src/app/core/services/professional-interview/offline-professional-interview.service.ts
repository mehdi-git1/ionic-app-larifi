import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { OfflineActionEnum } from '../../enums/offline-action.enum';
import { ProfessionalInterviewModel } from '../../models/professional-interview/professional-interview.model';

@Injectable()
export class OfflineProfessionalInterviewService {

    constructor(
        private storageService: StorageService
    ) {
    }

    /**
     * Sauvegarde un bilan professionel dans le cache
     * @param professionalInterview le bilan professionel à sauvegarder
     * @return une promesse contenant le bilan professionel sauvé
     */
    save(professionalInterview: ProfessionalInterviewModel): Promise<ProfessionalInterviewModel[]> {
        return this.storageService.saveAsync(EntityEnum.PROFESSIONAL_INTERVIEW, professionalInterview);
    }

    /**
     * Récupère les bilans professionels d'un PNC du cache à partir de son matricule
     * @param matricule le matricule du PNC
     * @return une promesse contenant les bilans professionels trouvés
     */
    getProfessionalInterviews(matricule: string): Promise<ProfessionalInterviewModel[]> {
        return Promise.resolve().then(() => {
            const professionalInterviewList = this.storageService.findAll(EntityEnum.PROFESSIONAL_INTERVIEW);
            const professionalInterviews = professionalInterviewList.filter(professionalInterview => {
                return professionalInterview.pnc.matricule === matricule && professionalInterview.offlineAction !== OfflineActionEnum.DELETE;
            });
            return (professionalInterviews);
        });
    }

}
