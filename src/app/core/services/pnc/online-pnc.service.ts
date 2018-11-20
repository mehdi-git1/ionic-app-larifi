import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { PncSearchCriteriaModel } from '../../models/pnc-search-criteria.model';
import { PagedPncModel } from '../../models/paged-pnc.model';
import { RotationModel } from '../../models/rotation.model';
import { RestService } from '../../http/rest/rest.base.service';
import { PncModel } from '../../models/pnc.model';

@Injectable()
export class OnlinePncService {

  constructor(
    public restService: RestService,
    public config: UrlConfiguration
  ) { }

  /**
   * Récupère les infos d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les infos
   * @return les informations du PNC
   */
  getPnc(matricule: string): Promise<PncModel> {
    return this.restService.get(this.config.getBackEndUrl('getPncByMatricule', [matricule]));
  }

  /**
   * Retrouve les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return les rotations à venir du PNC
   */
  getUpcomingRotations(matricule: string): Promise<RotationModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getPncUpcomingRotationsByMatricule', [matricule]));
  }

  /**
  * Retrouve les deux dernières rotations opérées par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer les dernières rotations opérées
  * @return les deux dernières rotations opérées par le PNC
  */
  getLastPerformedRotations(matricule: string): Promise<RotationModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getPncLastPerformedRotationsByMatricule', [matricule]));
  }


  /**
   * Récupère les PNC correspondant au filtre
   * @param matricule le matricule du PNC qu'on souhaite récupérer
   * @return une promesse contenant le PNC trouvé
   */
  getFilteredPncs(pncFilter: PncSearchCriteriaModel): Promise<PagedPncModel> {
    return this.restService.get(this.config.getBackEndUrl('pnc'), pncFilter).then(response =>
      response as PagedPncModel
    );
  }

}
