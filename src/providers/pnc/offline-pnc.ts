import { Rotation } from './../../models/rotation';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { EDossierPncObject } from '../../models/eDossierPncObject';
import { PncTransformerProvider } from './pnc-transformer';
@Injectable()
export class OfflinePncProvider {

  constructor(private storageService: StorageService, private pncTransformer: PncTransformerProvider) {
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
    return this.storageService.findOneAsync(Entity.PNC, matricule).then(offlinePnc => {
      return this.pncTransformer.toPnc(offlinePnc);
    });
  }

  /**
    * Récupère les PNCs du cache
    * @return une promesse contenant les PNC trouvés
    */
  getPncs(): Promise<Pnc[]> {
    return this.storageService.findAllAsync(Entity.PNC);
  }

  /**
   * Récupère les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return une promesse contenant la liste des rotations du PNC
   */
  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return new Promise((resolve, reject) => {
      let upcomingRotations = this.storageService.findAll(Entity.ROTATION);
      if (upcomingRotations != null) {
        upcomingRotations = upcomingRotations.filter(rotation => {
          const departureDate = new Date(rotation.departureDate);
          const nowDate = new Date(Date.parse(Date()));
          return departureDate > nowDate;
        });
      }
      resolve(upcomingRotations != null && upcomingRotations.length > 0 ? upcomingRotations : []);
    });
  }

  /**
   * Récupère la dernière rotation effectuée par un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer la dernière rotation réalisée
   * @return une promesse contenant la dernière rotation réalisée du PNC
   */
  getLastPerformedRotation(matricule: string): Promise<Rotation> {
    return new Promise((resolve, reject) => {
      let lastPerformedRotations = this.storageService.findAll(Entity.ROTATION);
      if (lastPerformedRotations != null) {
        lastPerformedRotations = lastPerformedRotations.filter(rotation => {
          const departureDate = new Date(rotation.departureDate);
          const nowDate = new Date(Date.parse(Date()));
          return departureDate < nowDate;
        });
      }
      resolve(lastPerformedRotations != null && lastPerformedRotations.length > 0 ? lastPerformedRotations[lastPerformedRotations.length - 1] : null);
    });
  }

  /**
 *  Met à jour la date de mise en cache dans l'objet online
 * @param pnc objet online
 */
  refreshOfflineStorageDate(pnc: Pnc): void {
    // cette méthode ne fait rien en mode offline
  }
}
