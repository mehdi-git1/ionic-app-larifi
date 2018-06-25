import { OfflinePncProvider } from './../offline-pnc/offline-pnc';
import { ConnectivityService } from './../../services/connectivity.service';
import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(public restService: RestService,
    public config: Config,
    private connectivityService: ConnectivityService,
    private offlinePncProvider: OfflinePncProvider) {
    this.pncUrl = `${config.backEndUrl}/pncs`;
  }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @param storeOffline si on doit stocker le résultat de l'appel en local
   * @return les informations du PNC
   */
  getPnc(matricule: string, storeOffline: boolean = false): Promise<Pnc> {
    if (this.connectivityService.isConnected()) {
      const promise: Promise<Pnc> = this.restService.get(`${this.pncUrl}/${matricule}`, null, null, storeOffline);
      if (storeOffline) {
        promise.then(pnc => {
          this.offlinePncProvider.save(new Pnc().fromJSON(pnc));
        });
      }
      return promise;
    } else {
      return this.offlinePncProvider.findOne(matricule);
    }
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

