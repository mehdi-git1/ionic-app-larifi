import { PncSearchCriteria } from './../../models/pnc-search-criteria';
import { SessionService } from './../../services/session.service';
import { Config } from './../../configuration/environment-variables/config';
import { PncFilter } from './../../models/pncFilter';
import { OnlinePncProvider } from './online-pnc';
import { OfflinePncProvider } from './../pnc/offline-pnc';
import { ConnectivityService } from './../../services/connectivity.service';
import { Rotation } from './../../models/rotation';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { PagedPnc } from './../../models/pagedPnc';
import { Page } from '../../models/page';
import { RestService } from '../../services/rest.base.service';
import { PncTransformerProvider } from './pnc-transformer';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(private connectivityService: ConnectivityService,
    private onlinePncProvider: OnlinePncProvider,
    private offlinePncProvider: OfflinePncProvider,
    private pncTransformer: PncTransformerProvider,
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
    return this.connectivityService.isConnected() ?
      this.onlinePncProvider.getPnc(matricule) :
      this.offlinePncProvider.getPnc(matricule);
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
   * Récupère les pncs du même secteur depuis le cache en offline ou depuis le serveur en online
   * @param pncFilter filtre de recherche, pas utilisé en offline
   * @return les pncs concernés (en offline : uniquement les pncs sur même secteur sauf le pnc connecté)
   */
  getFilteredPncs(pncFilter: PncFilter, page: number, size: number): Promise<PagedPnc> {
    const pncSearchCriteria = new PncSearchCriteria(pncFilter, page, size);

    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        return this.onlinePncProvider.getFilteredPncs(pncSearchCriteria).then(responsePnc => {
          const transformedContent = responsePnc.content.map(onlinePnc => {
            return this.pncTransformer.toPnc(onlinePnc);
          });
          responsePnc.content = transformedContent;
          return resolve(responsePnc);
        });
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

