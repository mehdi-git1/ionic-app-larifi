import { AppConstant } from './../../app/app.constant';
import { Rotation } from './../../models/rotation';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { last } from 'rxjs/operators';
import * as moment from 'moment';

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
  * Retrouve les deux dernières rotations opérées par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer les dernières rotations opérées
  * @return les deux dernières rotations opérées par le PNC
  */
  getLastPerformedRotations(matricule: string): Promise<Rotation[]> {
    return new Promise((resolve, reject) => {
      let lastPerformedRotations = this.storageService.findAll(Entity.ROTATION);
      if (lastPerformedRotations != null) {
        lastPerformedRotations = lastPerformedRotations.filter(rotation => {
          const departureDate = new Date(rotation.departureDate);
          const nowDate = new Date(Date.parse(Date()));
          return departureDate < nowDate;
        });
        // On tri par date de départ croissante
        lastPerformedRotations = lastPerformedRotations.sort((rotation1, rotation2) => {
          return moment(rotation1.departureDate, AppConstant.isoDateFormat).isBefore(moment(rotation2.departureDate, AppConstant.isoDateFormat)) ? -1 : 1;
        });
      }
      resolve(lastPerformedRotations != null && lastPerformedRotations.length > 0 ? lastPerformedRotations.slice(0, 2) : []);
    });
  }

}
