import { Injectable } from '@angular/core';
import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { EObservationModel } from '../../models/eobservation.model';
import { OfflineActionEnum } from '../../enums/offline-action.enum';

@Injectable()
export class OfflineEObservationService {

    constructor(
        private storageService: StorageService
    ) {
    }

    /**
     * Sauvegarde une eObservation dans le cache
     * @param eObservation l'eObservation à sauvegarder
     * @return une promesse contenant l'eObservation sauvée
     */
    save(eObservation: EObservationModel): Promise<EObservationModel[]> {
        return this.storageService.saveAsync(EntityEnum.EOBSERVATION, eObservation);
    }

    /**
     * Récupère les EObservations d'un PNC du cache à partir de son matricule
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    getEObservations(matricule: string): Promise<EObservationModel[]> {
        return new Promise((resolve, reject) => {
            const eObservationList = this.storageService.findAll(EntityEnum.EOBSERVATION);
            const eObservations = eObservationList.filter(careerObjective => {
                return careerObjective.pnc.matricule === matricule && careerObjective.offlineAction !== OfflineActionEnum.DELETE;
            });
            resolve(eObservations);
        });
    }
}
