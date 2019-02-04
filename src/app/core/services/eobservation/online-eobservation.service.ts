import { EObservationTransformerService } from './eobservation-transformer.service';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { EObservationModel } from '../../models/eobservation.model';

@Injectable()
export class OnlineEObservationService {

    constructor(
        public restService: RestService,
        public eObservationTransformerService: EObservationTransformerService,
        public config: UrlConfiguration
    ) { }

    /**
     * Récupère les EObservations d'un PNC à partir du back
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    getEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getEobservationsByMatricule', [matricule])).then(
            EObservations => {
                return this.eObservationTransformerService.toEObservations(EObservations);
            }
        );
    }

}
