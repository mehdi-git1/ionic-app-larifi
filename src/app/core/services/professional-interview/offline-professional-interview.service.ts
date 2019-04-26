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

   /**
   * Créé ou met à jour un bilan professionnel
   * @param  profesionnalInterview le bilan professionnel à créer ou mettre à jour
   * @return une promesse contenant le bilan professionnel créé ou mis à jour
   */
    createOrUpdate(professionalInterview: ProfessionalInterviewModel, online: boolean = false): Promise<ProfessionalInterviewModel> {
        return this.storageService.saveAsync(EntityEnum.PROFESSIONAL_INTERVIEW, professionalInterview, online);
    }

    /**
     * Supprime du cache un bilan professionnel à partir de son id
     * @param id l'id du bilan professionnel à supprimer
     * @return une promesse disant que la suppression s'est bien passée, ou pas
     */
    delete(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storageService.deleteAsync(EntityEnum.PROFESSIONAL_INTERVIEW, `${id}`).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

}
