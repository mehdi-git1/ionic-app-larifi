import { Injectable } from '@angular/core';

import { GenderEnum } from '../../enums/gender.enum';
import { PncSearchCriteriaModel } from '../../models/pnc-search-criteria.model';
import { SessionService } from '../session/session.service';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { PncFilterModel } from '../../models/pnc-filter.model';
import { OnlinePncService } from './online-pnc.service';
import { OfflinePncService } from './offline-pnc.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { RotationModel } from '../../models/rotation.model';
import { PncModel } from '../../models/pnc.model';
import { PagedPncModel } from '../../models/paged-pnc.model';
import { RestService } from '../../http/rest/rest.base.service';
import { BaseService } from '../base/base.service';
import {SpecialityEnum} from '../../enums/speciality.enum';

@Injectable()
export class PncService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlinePncProvider: OnlinePncService,
    private offlinePncProvider: OfflinePncService,
    private sessionService: SessionService,
    private restService: RestService,
    private config: UrlConfiguration
  ) {
    super(
      connectivityService,
      onlinePncProvider,
      offlinePncProvider
    );

  }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @return les informations du PNC
   */
  getPnc(matricule: string): Promise<PncModel> {
    return this.execFunctionProvider('getPnc', matricule);
  }


  /**
   * Retrouve les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return les rotations à venir du PNC
   */
  getUpcomingRotations(matricule: string): Promise<RotationModel[]> {
    return this.execFunctionProvider('getUpcomingRotations', matricule);
  }

  /**
  * Retrouve les deux dernières rotations opérées par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer les dernières rotations opérées
  * @return les deux dernières rotations opérées par le PNC
  */
  getLastPerformedRotations(matricule: string): Promise<RotationModel[]> {
    return this.execFunctionProvider('getLastPerformedRotations', matricule);
  }

  /**
   * Récupère les pncs du même secteur depuis le cache en offline ou depuis le serveur en online
   * @param pncFilter filtre de recherche, pas utilisé en offline
   * @return les pncs concernés (en offline : uniquement les pncs sur même secteur sauf le pnc connecté)
   */
  getFilteredPncs(pncFilter: PncFilterModel, page: number, size: number): Promise<PagedPncModel> {
    const pncSearchCriteria = new PncSearchCriteriaModel(pncFilter, page, size);
    return this.execFunctionProvider('getFilteredPncs', pncSearchCriteria);
  }

  /**
   * Fait appel au service rest qui renvoie les 10 premier pncs conçernés.
   * @param searchText matricuel/nom/prénom
   * @param byPassImpersonatedUser si on souhaite appeler le service en court circuitant la fonction d'impersonnification
   * @return les pncs concernés
   */
  pncAutoComplete(search: string, byPassImpersonatedUser: boolean = false): Promise<PncModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getPncAutoComplete'), { search }, undefined, byPassImpersonatedUser);
  }

  /**
   * Renvoie la spécialité du pnc en fonction de sa spécialité adminitrative et actuelle
   * @param pnc le pnc concerné
   * @return la fonction du pnc à afficher
   */
  public getFormatedSpeciality(pnc: PncModel): string {
    if (pnc.speciality) {
      // si le pnc est une hotesse, en remplace sa spécialité administrative (STW) par HOT
      pnc.speciality = pnc.speciality === SpecialityEnum.STW && pnc.gender === GenderEnum.F ? SpecialityEnum.HOT : pnc.speciality;
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