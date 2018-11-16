import { Injectable } from '@angular/core';
import { Config } from '../../../../configuration/environment-variables/config';

import { EObservation } from '../../models/eObservation';
import { RestService } from '../../../../services/rest/rest.base.service';

@Injectable()
export class OnlineEObservationProvider {

  constructor(
    public restService: RestService,
    public config: Config
  ) { }

  /**
   * Récupère une EObservation du cache à partir d'un matricule et le techId de la rotation
   * @param matricule le matricule du PNC concerné
   * @param rotationId le techId de la rotation concernée
   * @return une promesse contenant l'EObservation trouvée
   */
  getEObservation(matricule, rotationId: number): Promise<EObservation> {
    return this.restService.get(this.config.getBackEndUrl('getEobservation', [matricule, rotationId]));
  }
}
