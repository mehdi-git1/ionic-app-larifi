import { SessionService } from './../../services/session.service';
import { Config } from './../../configuration/environment-variables/config';
import { HttpRequest, HttpParams } from '@angular/common/http';
import { PncFilter } from './../../models/pncFilter';
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
import { RestService } from '../../services/rest.base.service';
import { RotationTransformerProvider } from '../rotation/rotation-transformer';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(private connectivityService: ConnectivityService,
    private onlinePncProvider: OnlinePncProvider,
    private offlinePncProvider: OfflinePncProvider,
    private offlineProvider: OfflineProvider,
    private pncTransformer: PncTransformerProvider,
    private rotationTransformer: RotationTransformerProvider,
    private sessionService: SessionService,
    private restService: RestService,
    private config: Config) {

    this.pncUrl = `${config.backEndUrl}/pncs`;
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
            resolve(onlineData); resolve(onlineData);
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
    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.offlinePncProvider.getUpcomingRotations(matricule).then(offlineRotations => {
          this.onlinePncProvider.getUpcomingRotations(matricule).then(onlineRotations => {
            const onlineData = this.rotationTransformer.toRotations(onlineRotations);
            const offlineData = this.rotationTransformer.toRotations(offlineRotations);
            this.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
            resolve(onlineData);
          });
        });
      });
    } else {
      return this.offlinePncProvider.getUpcomingRotations(matricule);
    }
  }

  /**
  * Retrouve la dernière rotation opérée par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer la dernière rotation opérée
  * @return la dernière rotation opérée par le PNC
  */
  getLastPerformedRotation(matricule: string): Promise<Rotation> {
    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.offlinePncProvider.getLastPerformedRotation(matricule).then(offlineRotations => {
          this.onlinePncProvider.getLastPerformedRotation(matricule).then(onlineRotations => {
            const onlineData = this.rotationTransformer.toRotation(onlineRotations);
            const offlineData = this.rotationTransformer.toRotation(offlineRotations);
            this.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
            resolve(onlineData);
          });
        });
      });
    } else {
      return this.offlinePncProvider.getLastPerformedRotation(matricule);
    }
  }

  /**
  * Alimente le PNC avec sa date de fraicheur en cache
  * @param onlinePnc PNC récupéré du back
  * @return pnc en paramètre alimenté avec sa fraicheur dans le cache
  */
  refreshOffLineDateOnPnc(onlinePnc: Pnc): Promise<Pnc> {
    return new Promise((resolve, reject) => {
      this.offlinePncProvider.getPnc(onlinePnc.matricule).then(offlinePnc => {
        const offlineData = this.pncTransformer.toPnc(offlinePnc);
        this.offlineProvider.flagDataAvailableOffline(onlinePnc, offlineData);
        resolve(onlinePnc);
      });
    });
  }

  /**
   * Récupère les pncs du même secteur depuis le cache en offline ou depuis le serveur en online
   * @param pncFilter filtre de recherche, pas utilisé en offline
   * @return les pncs concernés (en offline : uniquement les pncs sur même secteur sauf le pnc connecté)
   */
  getFilteredPncs(pncFilter: PncFilter): Promise<PagedPnc> {
    if (this.connectivityService.isConnected()) {
      return this.onlinePncProvider.getFilteredPncs(pncFilter).then(responsePnc => {

        const promises: Promise<Pnc>[] = new Array();

        responsePnc.content.forEach(onlinePnc => {
          const transformedPnc = this.pncTransformer.toPnc(onlinePnc);
          promises.push(this.refreshOffLineDateOnPnc(transformedPnc));
        });
        return Promise.all(promises).then(values => {
          responsePnc.content = values;
          return responsePnc;
        });

      });
    } else {
      return this.offlinePncProvider.getPncs().then(response => {
        return this.offlinePncProvider.getPnc(this.sessionService.authenticatedUser.matricule).then(connectedPnc => {
          const filteredPnc = response.filter(pnc =>
            (pnc.assignment.division === connectedPnc.assignment.division)
            && (pnc.assignment.sector === connectedPnc.assignment.sector)
            && (pnc.matricule !== connectedPnc.matricule));
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

  /**
   * Fait appel au service rest qui renvoie les 10 premier pncs conçernés.
   * @param searchText matricuel/nom/prénom
   * @return les pncs concernés
   */
  pncAutoComplete(search: string): Promise<Pnc[]> {
    return this.restService.get(`${this.pncUrl}/auto_complete`, { search });
  }
}

