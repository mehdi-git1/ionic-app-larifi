import { Injectable } from '@angular/core';
import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { SessionService } from '../session/session.service';
import { EObservationModel } from '../../models/EObservation.model';

@Injectable()
export class OfflineEObservationService {

    constructor(
        private storageService: StorageService,
        private sessionService: SessionService
    ) {
    }

    /**
     * Sauvegarde un PNC dans le cache
     * @param pnc le PNC à sauvegarder
     * @return une promesse contenant le PNC sauvé
     */
    save(pnc: EObservationModel): Promise<EObservationModel[]> {
        return this.storageService.saveAsync(EntityEnum.EOBSERVATION, pnc);
    }

    /**
     * Récupère les EObservations d'un PNC du cache à partir de son matricule
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvé
     */
    getEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.storageService.findOneAsync(EntityEnum.EOBSERVATION, matricule);
    }

}
