import { Gender } from '../../models/gender';
import { Speciality } from '../../models/speciality';
import { PncSearchCriteria } from '../../models/pnc-search-criteria';
import { SessionService } from '../../../../services/session.service';
import { Config } from '../../../../configuration/environment-variables/config';
import { PncFilter } from '../../models/pncFilter';
import { OnlinePncProvider } from './online-pnc';
import { OfflinePncProvider } from './offline-pnc';
import { ConnectivityService } from '../../../../services/connectivity/connectivity.service';
import { Rotation } from '../../models/rotation';
import { Pnc } from '../../models/pnc';
import { Injectable } from '@angular/core';
import { PagedPnc } from '../../models/pagedPnc';
import { Page } from '../../models/page';
import { RestService } from '../../../../services/rest/rest.base.service';
import { BaseProvider } from '../base/base.provider';

@Injectable()
export class PncProvider extends BaseProvider {
  private pncUrl: string;

  constructor(
    protected connectivityService: ConnectivityService,
    private onlinePncProvider: OnlinePncProvider,
    private offlinePncProvider: OfflinePncProvider,
    private sessionService: SessionService,
    private restService: RestService,
    private config: Config
  ) {
    super(
      connectivityService,
      onlinePncProvider,
      offlinePncProvider
    );
    this.pncUrl = `${config.backEndUrl}/pncs`;
  }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @return les informations du PNC
   */
  getPnc(matricule: string): Promise<Pnc> {
    return this.execFunctionProvider('getPnc', matricule);
  }


  /**
   * Retrouve les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return les rotations à venir du PNC
   */
  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return this.execFunctionProvider('getUpcomingRotations', matricule);
  }

  /**
  * Retrouve les deux dernières rotations opérées par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer les dernières rotations opérées
  * @return les deux dernières rotations opérées par le PNC
  */
  getLastPerformedRotations(matricule: string): Promise<Rotation[]> {
    return this.execFunctionProvider('getLastPerformedRotations', matricule);
  }

  /**
   * Récupère les pncs du même secteur depuis le cache en offline ou depuis le serveur en online
   * @param pncFilter filtre de recherche, pas utilisé en offline
   * @return les pncs concernés (en offline : uniquement les pncs sur même secteur sauf le pnc connecté)
   */
  getFilteredPncs(pncFilter: PncFilter, page: number, size: number): Promise<PagedPnc> {
    const pncSearchCriteria = new PncSearchCriteria(pncFilter, page, size);
    return this.execFunctionProvider('getFilteredPncs', pncSearchCriteria);
  }

  /**
   * Fait appel au service rest qui renvoie les 10 premier pncs conçernés.
   * @param searchText matricuel/nom/prénom
   * @param byPassImpersonatedUser si on souhaite appeler le service en court circuitant la fonction d'impersonnification
   * @return les pncs concernés
   */
  pncAutoComplete(search: string, byPassImpersonatedUser: boolean = false): Promise<Pnc[]> {
    return this.restService.get(`${this.pncUrl}/auto_complete`, { search }, undefined, byPassImpersonatedUser);
  }

  /**
   * Renvoie la spécialité du pnc en fonction de sa spécialité adminitrative et actuelle
   * @param pnc le pnc concerné
   * @return la fonction du pnc à afficher
   */
  public getFormatedSpeciality(pnc: Pnc): string {
    if (pnc.speciality) {
      // si le pnc est une hotesse, en remplace sa spécialité administrative (STW) par HOT
      pnc.speciality = pnc.speciality === Speciality.STW && pnc.gender === Gender.F ? Speciality.HOT : pnc.speciality;
      // on teste si la spécialité administrative est égale a la spécialité actuelle
      if (!pnc.currentSpeciality || (pnc.currentSpeciality && pnc.speciality === pnc.currentSpeciality)) {
        return pnc.speciality;
      }
      // on teste si la spécialité administrative est différente dela spécialité actuelle
      if (pnc.currentSpeciality && pnc.speciality !== pnc.currentSpeciality) {
        return pnc.speciality + '/' + pnc.currentSpeciality;
      }
    } else {
      return null;
    }
  }
}
