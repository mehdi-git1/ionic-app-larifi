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
import { RotationProvider } from '../rotation/rotation';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(private connectivityService: ConnectivityService,
    private onlinePncProvider: OnlinePncProvider,
    private offlinePncProvider: OfflinePncProvider,
    private offlineProvider: OfflineProvider,
    private pncTransformer: PncTransformerProvider,
    private rotationTransformer: RotationTransformerProvider,
    private rotationProvider: RotationProvider,
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
        this.onlinePncProvider.getPnc(matricule).then(onlinePnc => {
          const onlineData = this.pncTransformer.toPnc(onlinePnc);
          resolve(onlineData);
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
        this.onlinePncProvider.getUpcomingRotations(matricule).then(onlineRotations => {
          const onlineData = this.rotationTransformer.toRotations(onlineRotations);
          resolve(onlineData);
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
        this.onlinePncProvider.getLastPerformedRotation(matricule).then(onlineRotation => {
          if (onlineRotation) {
            const onlineData = this.rotationTransformer.toRotation(onlineRotation);
            resolve(onlineData);
          } else {
            resolve(onlineRotation);
          }
        });
      });
    } else {
      return this.offlinePncProvider.getLastPerformedRotation(matricule);
    }
  }

  /**
   * Récupère les pncs du même secteur depuis le cache en offline ou depuis le serveur en online
   * @param pncFilter filtre de recherche, pas utilisé en offline
   * @return les pncs concernés (en offline : uniquement les pncs sur même secteur sauf le pnc connecté)
   */
  getFilteredPncs(pncFilter: PncFilter): Promise<PagedPnc> {
    if (this.connectivityService.isConnected()) {
      return this.onlinePncProvider.getFilteredPncs(pncFilter).then(responsePnc => {
        const transformedContent = responsePnc.content.map(onlinePnc => {
          return this.pncTransformer.toPnc(onlinePnc);
        });
        responsePnc.content = transformedContent;
        return responsePnc;
      });
    } else {
      return this.offlinePncProvider.getPncs().then(response => {
        return this.offlinePncProvider.getPnc(this.sessionService.authenticatedUser.matricule).then(connectedPnc => {
          let filteredPnc = response;
          if (connectedPnc.assignment.division !== 'ADM') {
            filteredPnc = response.filter(pnc =>
              (pnc.assignment.division === connectedPnc.assignment.division)
              && (pnc.assignment.sector === connectedPnc.assignment.sector)
              && (pnc.matricule !== connectedPnc.matricule));
          }
          filteredPnc.sort((a, b) => { if (a.lastName < b.lastName) { return -1; } else { return 1; } });
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

  /**
   *  Met à jour la date de mise en cache dans l'objet online
   * @param pnc objet online
   */
  refreshOfflineStorageDate(pnc: Pnc): void {
    this.connectivityService.isConnected() ?
      this.onlinePncProvider.refreshOfflineStorageDate(pnc) : this.offlinePncProvider.refreshOfflineStorageDate(pnc);
  }
}

