import { PncSearchCriteria } from './../../models/pnc-search-criteria';
import { PagedPnc } from './../../models/pagedPnc';
import { Rotation } from './../../models/rotation';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest/rest.base.service';
import { Pnc } from '../../models/pnc';

@Injectable()
export class OnlinePncProvider {
  private pncUrl: string;

  constructor(public restService: RestService,
    public config: Config) {
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
  * Retrouve les deux dernières rotations opérées par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer les dernières rotations opérées
  * @return les deux dernières rotations opérées par le PNC
  */
  getLastPerformedRotations(matricule: string): Promise<Rotation[]> {
    return this.restService.get(`${this.pncUrl}/${matricule}/last_performed_rotations`);
  }


  /**
   * Récupère les PNC correspondant au filtre
   * @param matricule le matricule du PNC qu'on souhaite récupérer
   * @return une promesse contenant le PNC trouvé
   */
  getFilteredPncs(pncFilter: PncSearchCriteria): Promise<PagedPnc> {
    return this.restService.get(this.pncUrl, pncFilter).then(response =>
      response as PagedPnc
    );
  }

}
