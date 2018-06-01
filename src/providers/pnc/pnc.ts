import { Rotation } from './../../models/rotation';
import { Pnc } from './../../models/pnc';
import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(public restService: RestService) {
    this.pncUrl = `${AppConfig.apiUrl}/pncs`;
  }

  /**
   * Fait appel au service rest qui renvois les informations.
   * @param matricule
   * @return les informations du pnc
   */
  getPnc(matricule: string): Promise<Pnc> {
    return this.restService.get(`${this.pncUrl}/${matricule}`);
  }

  /**
   * Retrouve les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return les rotations à venir du PNC
   */
  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return this.restService.get(`${this.pncUrl}/${matricule}/upcoming_rotations`);
  }

  /**
  * Retrouve la dernière rotation opérée par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer la dernière rotation opérée
  * @return la dernière rotation opérée par le PNC
  */
  getLastPerformedRotation(matricule: string): Promise<Rotation> {
    return this.restService.get(`${this.pncUrl}/${matricule}/last_performed_rotation`);
  }
}

