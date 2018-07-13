import { SessionService } from './../../services/session.service';
import { PncTransformerProvider } from './pnc-transformer';
import { OfflineProvider } from './../offline/offline';
import { OnlinePncProvider } from './online-pnc';
import { OfflinePncProvider } from './../pnc/offline-pnc';
import { ConnectivityService } from './../../services/connectivity.service';
import { Rotation } from './../../models/rotation';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { PagedPnc } from './../../models/pagedPnc';
import { Page } from '../../models/page';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(private connectivityService: ConnectivityService,
    private onlinePncProvider: OnlinePncProvider,
    private offlinePncProvider: OfflinePncProvider,
    private offlineProvider: OfflineProvider,
    private pncTransformer: PncTransformerProvider,
    private sessionService: SessionService) {
  }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @return les informations du PNC
   */
  getPnc(matricule: string): Promise<Pnc> {
    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.offlinePncProvider.getPnc(matricule).then(offlinePnc => {
          this.onlinePncProvider.getPnc(matricule).then(onlinePnc => {
            const onlineData = this.pncTransformer.toPnc(onlinePnc);
            const offlineData = this.pncTransformer.toPnc(offlinePnc);
            this.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
            resolve(onlineData);
          });
        });
      });
    } else {
      return this.offlinePncProvider.getPnc(matricule);
    }
  }

  /**
   * Retrouve les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return les rotations à venir du PNC
   */
  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return this.connectivityService.isConnected() ?
      this.onlinePncProvider.getUpcomingRotations(matricule) :
      this.offlinePncProvider.getUpcomingRotations(matricule);
  }

  /**
  * Retrouve la dernière rotation opérée par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer la dernière rotation opérée
  * @return la dernière rotation opérée par le PNC
  */
  getLastPerformedRotation(matricule: string): Promise<Rotation> {
    return this.connectivityService.isConnected() ?
      this.onlinePncProvider.getLastPerformedRotation(matricule) :
      this.offlinePncProvider.getLastPerformedRotation(matricule);
  }


  /**
   * Récupère les pncs du même secteur depuis le cache
   * @return les pncs concernés sauf le pnc connecté
   */
  getFilteredPncs(): Promise<PagedPnc> {
    return this.offlinePncProvider.getPncs().then(response => {
      return this.offlinePncProvider.getPnc(this.sessionService.authenticatedUser.matricule).then(connectedPnc => {
        const filteredPnc = response.filter(pnc =>
          (pnc.assignment.sector === connectedPnc.assignment.sector) && (pnc.matricule !== connectedPnc.matricule));
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

}

