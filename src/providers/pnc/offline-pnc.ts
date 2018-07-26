import { Rotation } from './../../models/rotation';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { EDossierPncObject } from '../../models/eDossierPncObject';

@Injectable()
export class OfflinePncProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Sauvegarde un PNC dans le cache
   * @param pnc le PNC à sauvegarder
   * @return une promesse contenant le PNC sauvé
   */
  save(pnc: Pnc): Promise<Pnc> {
    return this.storageService.saveAsync(Entity.PNC, pnc);
  }

  /**
   * Récupère un PNC du cache à partir de son matricule
   * @param matricule le matricule du PNC qu'on souhaite récupérer
   * @return une promesse contenant le PNC trouvé
   */
  getPnc(matricule: string): Promise<Pnc> {
    return this.storageService.findOneAsync(Entity.PNC, matricule);
  }

  /**
   * Récupère les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return une promesse contenant la liste des rotations du PNC
   */
  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return new Promise((resolve, reject) => {
      const rotations = this.storageService.findAll(Entity.ROTATION);
      rotations.filter(rotation => {
        return rotation.pncs.matricule === matricule;
      });
      resolve(rotations);
    });
  }

  /**
   * Récupère la dernière rotation effectuée par un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer la dernière rotation réalisée
   * @return une promesse contenant la dernière rotation réalisée du PNC
   */
  getLastPerformedRotation(matricule: string): Promise<Rotation> {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }

}
