import { Injectable } from '@angular/core';
import { UrlConfiguration } from '../../configuration/url.configuration';

import { EObservationModel } from '../../models/e-observation.model';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable()
export class OnlineEObservationService {

  constructor(
    public restService: RestService,
    public config: UrlConfiguration
  ) { }

  /**
   * Récupère une EObservationModel du cache à partir d'un matricule et le techId de la rotation
   * @param matricule le matricule du PNC concerné
   * @param rotationId le techId de la rotation concernée
   * @return une promesse contenant l'EObservationModel trouvée
   */
  getEObservation(matricule, rotationId: number): Promise<EObservationModel> {
    return this.restService.get(this.config.getBackEndUrl('getEobservation', [matricule, rotationId]));
  }
}
