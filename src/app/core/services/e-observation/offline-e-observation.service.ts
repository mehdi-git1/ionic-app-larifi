import { Injectable } from '@angular/core';

import { EObservationModel } from '../../models/e-observation.model';
import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class OfflineEObservationService {

  constructor(private storageService: StorageService) {
  }

  /**
   * Sauvegarde une EObservationModel dans le cache
   * @param eObservation l'EObservationModel à sauvegarder
   * @return une promesse contenant l'EObservationModel sauvée
   */
  save(eObservation: EObservationModel): Promise<EObservationModel> {
    return this.storageService.saveAsync(EntityEnum.EOBSERVATION, eObservation);
  }

  /**
   * Récupère une EObservationModel du cache à partir d'un matricule et le techId de la rotation
   * @param matricule le matricule du PNC concerné
   * @param rotationId le techId de la rotation concernée
   * @return une promesse contenant l'EObservationModel trouvée
   */
  getEObservation(matricule: string, rotationId: number): Promise<EObservationModel> {
    return this.storageService.findOneAsync(EntityEnum.EOBSERVATION, `${matricule}-${rotationId}`);
  }

  /**
    * Récupère les EObservations du cache
    * @return une promesse contenant les EObservations trouvées
    */
  getEObservations(): Promise<EObservationModel[]> {
    return this.storageService.findAllAsync(EntityEnum.EOBSERVATION);
  }
}
