import { EObservation } from './../../models/eObservation';
import { Rotation } from '../../models/rotation';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest/rest.base.service';

@Injectable()
export class OnlineEObservationProvider {
  private eObservationUrl: string;

  constructor(public restService: RestService,
    public config: Config) {
    this.eObservationUrl = `${config.backEndUrl}/eobservation`;
  }

  /**
   * Récupère une EObservation du cache à partir d'un matricule et le techId de la rotation
   * @param matricule le matricule du PNC concerné
   * @param rotationId le techId de la rotation concernée
   * @return une promesse contenant l'EObservation trouvée
   */
  getEObservation(matricule, rotationId: number): Promise<EObservation> {
    return this.restService.get(`${this.eObservationUrl}/${matricule}/${rotationId}`);
  }
}
