import { Injectable } from '@angular/core';

import { Config } from './../../configuration/environment-variables/config';
import { PncSearchCriteria } from './../../models/pnc-search-criteria';
import { PagedPnc } from './../../models/pagedPnc';
import { Rotation } from './../../models/rotation';
import { RestService } from '../../services/rest/rest.base.service';
import { Pnc } from '../../models/pnc';

@Injectable()
export class OnlinePncProvider {

  constructor(
    public restService: RestService,
    public config: Config
  ) { }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @return les informations du PNC
   */
  getPnc(matricule: string): Promise<Pnc> {
    return this.restService.get(this.config.getBackEndUrl('getPncByMatricule', [matricule]));
  }

  /**
   * Retrouve les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return les rotations à venir du PNC
   */
  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return this.restService.get(this.config.getBackEndUrl('getPncUpcomingRotationsByMatricule', [matricule]));
  }

  /**
  * Retrouve les deux dernières rotations opérées par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer les dernières rotations opérées
  * @return les deux dernières rotations opérées par le PNC
  */
  getLastPerformedRotations(matricule: string): Promise<Rotation[]> {
    return this.restService.get(this.config.getBackEndUrl('getPncLastPerformedRotationsByMatricule', [matricule]));
  }


  /**
   * Récupère les PNC correspondant au filtre
   * @param matricule le matricule du PNC qu'on souhaite récupérer
   * @return une promesse contenant le PNC trouvé
   */
  getFilteredPncs(pncFilter: PncSearchCriteria): Promise<PagedPnc> {
    return this.restService.get(this.config.getBackEndUrl('pnc'), pncFilter).then(response =>
      response as PagedPnc
    );
  }

}
