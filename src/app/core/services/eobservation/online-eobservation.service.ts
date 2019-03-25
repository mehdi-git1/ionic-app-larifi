import { EObservationTransformerService } from './eobservation-transformer.service';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { EObservationModel } from '../../models/eobservation/eobservation.model';

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
        return this.restServiceGetEObservations('getEObservationsByMatricule', matricule);
    }

    /**
    * Récupère les EObservations d'un PNC à partir du back
    * @param matricule le matricule du PNC
    * @return une promesse contenant les EObservations trouvées
    */
    getAllEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.restServiceGetEObservations('getAllEObservationsByMatricule', matricule);
    }

    /** Appel vers la back
     * @param url  url à appeler
     * @param matricule matricule du PNC
     * @return une promesse contenant les EObservations trouvées
    */
    restServiceGetEObservations(url: string, matricule: string): Promise<EObservationModel[]> {
        return this.restService.get(this.config.getBackEndUrl(url, [matricule])).then(
            eObservations => {
                return this.eObservationTransformerService.toEObservations(eObservations);
            }
        );
    }

    /**
    * Valide une eObservation
    * @param eObservation l'eObservation à valider
    * @return une promesse contenant l'eObservation validée
    */
    validateEObservation(eObservation: EObservationModel): Promise<EObservationModel> {
        return this.restService.post(this.config.getBackEndUrl('eObservations'), eObservation);
    }

}
