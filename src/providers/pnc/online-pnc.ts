import { PncTransformerProvider } from './pnc-transformer';
import { OfflineProvider } from './../offline/offline';
import { PagedPnc } from './../../models/pagedPnc';
import { PncFilter } from './../../models/pncFilter';
import { Rotation } from './../../models/rotation';
import { OfflinePncProvider } from './offline-pnc';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Pnc } from '../../models/pnc';

@Injectable()
export class OnlinePncProvider {
  private pncUrl: string;

  constructor(public restService: RestService,
    public config: Config,
    private offlinePncProvider: OfflinePncProvider,
    private offlineProvider: OfflineProvider,
    private pncTransformer: PncTransformerProvider) {
    this.pncUrl = `${config.backEndUrl}/pncs`;
  }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @return les informations du PNC
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


  /**
   * Récupère les PNC correspondant au filtre
   * @param matricule le matricule du PNC qu'on souhaite récupérer
   * @return une promesse contenant le PNC trouvé
   */
  getFilteredPncs(pncFilter: PncFilter): Promise<PagedPnc> {
    return this.restService.get(this.pncUrl, pncFilter).then(response =>
      response as PagedPnc
    );
  }

  /**
   *  Met à jour la date de mise en cache dans l'objet online
   * @param pnc objet online
   */
  refreshOfflineStorageDate(pnc: Pnc): void {
    this.offlinePncProvider.getPnc(pnc.matricule).then(offlinePnc => {
      const offlineData = this.pncTransformer.toPnc(offlinePnc);
      this.offlineProvider.flagDataAvailableOffline(pnc, offlinePnc);
    });
  }
}
