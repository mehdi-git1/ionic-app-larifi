import { PagedPnc } from './../../models/pagedPnc';
import { SessionService } from './../../services/session.service';
import { AppConstant } from './../../app/app.constant';
import { Rotation } from './../../models/rotation';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Page } from '../../models/page';

@Injectable()
export class OfflinePncProvider {

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
  getFilteredPncs(): Promise<PagedPnc> {
    return this.storageService.findAllAsync(Entity.PNC).then(response => {
      return this.getPnc(this.sessionService.authenticatedUser.matricule).then(connectedPnc => {
        let filteredPnc = response;
        if (connectedPnc.assignment.division !== 'ADM') {
          filteredPnc = response.filter(pnc =>
            (pnc.assignment.division === connectedPnc.assignment.division)
            && (pnc.assignment.sector === connectedPnc.assignment.sector)
            && (pnc.matricule !== connectedPnc.matricule));
        }
        filteredPnc.sort((a, b) => a.lastName < b.lastName ? -1 : 1);
        const pagedPncResponse: PagedPnc = new PagedPnc();
        pagedPncResponse.content = filteredPnc;
        pagedPncResponse.page = new Page();
        pagedPncResponse.page.size = filteredPnc.length;
        pagedPncResponse.page.totalElements = filteredPnc.length;
        pagedPncResponse.page.number = 0;
        return pagedPncResponse;
      });
    });
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

  /**
   * Vérifie si un pnc se trouve en cache
   * @param matricule le matricule du pnc
   * @return vrai si le pnc est trouvé en cache, faux sinon
   */
  pncExists(matricule: string): boolean {
    return this.storageService.findOne(Entity.PNC, matricule) !== null;
  }

}
