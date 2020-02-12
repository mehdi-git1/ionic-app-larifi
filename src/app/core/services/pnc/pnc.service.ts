import { HaulTypeEnum } from 'src/app/core/enums/haul-type.enum';

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { GenderEnum } from '../../enums/gender.enum';
import { SpecialityEnum } from '../../enums/speciality.enum';
import { RestService } from '../../http/rest/rest.base.service';
import { PagedPncModel } from '../../models/paged-pnc.model';
import { PncFilterModel } from '../../models/pnc-filter.model';
import { PncSearchCriteriaModel } from '../../models/pnc-search-criteria.model';
import { PncModel } from '../../models/pnc.model';
import { RotationModel } from '../../models/rotation.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { SessionService } from '../session/session.service';
import { OfflinePncService } from './offline-pnc.service';
import { OnlinePncService } from './online-pnc.service';

@Injectable({ providedIn: 'root' })
export class PncService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlinePncService: OnlinePncService,
    private offlinePncService: OfflinePncService,
    private restService: RestService,
    private config: UrlConfiguration,
    private sessionService: SessionService
  ) {
    super(
      connectivityService,
      onlinePncService,
      offlinePncService
    );

  }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @return les informations du PNC
   */
  getPnc(matricule: string): Promise<PncModel> {
    if (this.sessionService.getActiveUser().matricule === matricule) {
      return Promise.resolve(this.sessionService.getActiveUser().authenticatedPnc);
    }
    if (this.sessionService.visitedPnc && this.sessionService.visitedPnc.matricule === matricule) {
      return Promise.resolve(this.sessionService.visitedPnc);
    }
    return this.execFunctionService('getPnc', matricule);
  }

  /**
   * Retrouve les rotations opérées et à faire par un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations
   * @return une promesse contenant les rotations opérées et à faire par le PNC
   */
  getAllRotations(matricule: string): Promise<RotationModel[]> {
    return this.execFunctionService('getAllRotationsByMatricule', matricule);
  }

  /**
   * Récupère les pncs du même secteur depuis le cache en offline ou depuis le serveur en online
   * @param pncFilter filtre de recherche, pas utilisé en offline
   * @return les pncs concernés (en offline : uniquement les pncs sur même secteur sauf le pnc connecté)
   */
  getFilteredPncs(pncFilter: PncFilterModel, page: number, size: number): Promise<PagedPncModel> {
    const pncSearchCriteria = new PncSearchCriteriaModel(pncFilter, page, size);
    return this.execFunctionService('getFilteredPncs', pncSearchCriteria);
  }

  /**
   * Fait appel au service rest qui renvoie les 10 premier pncs conçernés.
   * @param searchText matricuel/nom/prénom
   * @param byPassImpersonatedUser si on souhaite appeler le service en court circuitant la fonction d'impersonnification
   * @return les pncs concernés
   */
  pncAutoComplete(search: string, byPassImpersonatedUser: boolean = false): Promise<PncModel[]> {
    return this.restService.post(this.config.getBackEndUrl('getPncAutoComplete'), { searchText: search }, undefined, byPassImpersonatedUser);
  }

  /**
   * Renvoie la spécialité du pnc en fonction de sa spécialité adminitrative et actuelle
   * @param pnc le pnc concerné
   * @return la fonction du pnc à afficher
   */
  public getFormatedSpeciality(pnc: PncModel): string {
    if (pnc && pnc.speciality) {
      // si le pnc est une hotesse, en remplace sa spécialité administrative (STW) par HOT
      const administrativeSpeciality = pnc.speciality === SpecialityEnum.STW && pnc.gender === GenderEnum.F ? SpecialityEnum.HOT : pnc.speciality;
      // on teste si la spécialité administrative est égale a la spécialité actuelle
      if (!pnc.currentSpeciality || (pnc.currentSpeciality && administrativeSpeciality === pnc.currentSpeciality)) {
        return administrativeSpeciality;
      }
      // on teste si la spécialité administrative est différente dela spécialité actuelle
      if (pnc.currentSpeciality && administrativeSpeciality !== pnc.currentSpeciality) {
        return administrativeSpeciality + '/' + pnc.currentSpeciality;
      }
    } else {
      return null;
    }
  }

  /**
   * Retourne le matricule du PNC demandé.
   * Il s'agit du matricule présent dans l'url (dans le cas où on visite un dossier d'une autre personne)
   * ou du matricule de la personne connecté si rien n'est trouvé dans l'url
   * @param activatedRoute la route à analyser, dans laquelle on peut potentiellement trouver le matricule
   * @return le matricule à traiter
   */
  getRequestedPncMatricule(activatedRoute: ActivatedRoute): string {
    if (activatedRoute.snapshot.paramMap.get('matricule')) {
      return activatedRoute.snapshot.paramMap.get('matricule');
    } else {
      // Si le matricule n'est pas présent dans l'url, on retourne le matricule du user connecté
      return this.sessionService.getActiveUser().matricule;
    }
  }

  /**
   * Vérifie si le PNC est CC et vole sur LC
   * @param pnc le pnc à tester
   * @return vrai si c'est le cas, faux sinon
   */
  isCcLc(pnc: PncModel): boolean {
    return pnc.currentSpeciality === SpecialityEnum.CC && pnc.haulType === HaulTypeEnum.LC;
  }

}
