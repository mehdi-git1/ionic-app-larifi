import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { OfflineActionEnum } from '../../enums/offline-action.enum';
import { EObservationModel } from '../../models/eobservation/eobservation.model';
import { PdfModel } from '../../models/manifex/manifex-pdf.model';
import { StorageService } from '../../storage/storage.service';

@Injectable({ providedIn: 'root' })
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
    public save(eObservation: EObservationModel): Promise<EObservationModel[]> {
        return this.storageService.saveAsync(EntityEnum.EOBSERVATION, eObservation);
    }

    /**
     * Récupère les EObservations d'un PNC du cache à partir de son matricule
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    public getEObservations(matricule: string): Promise<EObservationModel[]> {
        return new Promise((resolve, reject) => {
            const eObservationList = this.storageService.findAll(EntityEnum.EOBSERVATION);
            const eObservations = eObservationList.filter(eObservation => {
                return eObservation.pnc.matricule === matricule && eObservation.offlineAction !== OfflineActionEnum.DELETE;
            });
            resolve(eObservations);
        });
    }

    /**
     * Met à jour une eObservation
     * @param eObservation l'eObservation à valider
     * @return une promesse contenant l'eObservation validée
     */
    public updateEObservation(eObservation: EObservationModel): Promise<EObservationModel> {
        return this.storageService.saveAsync(EntityEnum.EOBSERVATION, eObservation, false);
    }

    /**
     * Récupère une eObservation à partir de son id
     * @param id l'id de l'eObservation à récupérer
     * @return une promesse contenant l'eObservation récupérée
     */
    public getEObservation(id: number): Promise<EObservationModel> {
        return this.storageService.findOneAsync(EntityEnum.EOBSERVATION, `${id}`);
    }

    /**
     * @param matricule matricule du redacteur
     * @return une promesse nulle car les observations par rédacteur ne sont pas disponibles hors ligne
     */
    public findEObservationsByRedactor(matricule: string): Promise<EObservationModel[]> {
        return Promise.resolve(null);
    }

    /**
     * En offline, pas de récupération de PDF possible
     * @param id l'id de l'eObservation qu'on souhaite avoir en PDF
     * @return une promesse vide
     */
    public getEObservationPdf(id: number): Promise<PdfModel> {
        return Promise.resolve(null);
    }
}
