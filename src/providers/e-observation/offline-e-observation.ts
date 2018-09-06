import { EObservation } from './../../models/eObservation';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class OfflineEObservationProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Sauvegarde une EObservation dans le cache
   * @param eObservation l'EObservation à sauvegarder
   * @return une promesse contenant l'EObservation sauvée
   */
  save(eObservation: EObservation): Promise<EObservation> {
    return this.storageService.saveAsync(Entity.EOBSERVATION, eObservation);
  }

  /**
   * Récupère une EObservation du cache à partir d'un matricule et le techId de la rotation
   * @param matricule le matricule du PNC concerné
   * @param rotationId le techId de la rotation concernée
   * @return une promesse contenant l'EObservation trouvée
   */
  getEObservation(matricule: string, rotationId: number): Promise<EObservation> {
    return this.storageService.findOneAsync(Entity.EOBSERVATION, `${matricule}-${rotationId}`);
  }

  /**
    * Récupère les EObservations du cache
    * @return une promesse contenant les EObservations trouvées
    */
  getEObservations(): Promise<EObservation[]> {
    return this.storageService.findAllAsync(Entity.EOBSERVATION);
  }
}