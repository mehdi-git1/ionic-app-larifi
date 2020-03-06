import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import {
    ReferentialItemLevelModel
} from '../../models/eobservation/eobservation-referential-item-level.model';
import { EObservationModel } from '../../models/eobservation/eobservation.model';
import { EObservationTransformerService } from './eobservation-transformer.service';

@Injectable({ providedIn: 'root' })
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
    public getEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.restServiceGetEObservations('getEObservationsByMatricule', matricule);
    }

    /**
     * Récupère les EObservations d'un PNC à partir du back
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    public getAllEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.restServiceGetEObservations('getAllEObservationsByMatricule', matricule);
    }

    /**
     * Appel vers le back  et renvoie toutes les eObservations d'un pnc
     * @param url  url à appeler
     * @param matricule matricule du PNC
     * @return une promesse contenant les EObservations trouvées
    */
    private restServiceGetEObservations(url: string, matricule: string): Promise<EObservationModel[]> {
        return this.restService.get(this.config.getBackEndUrl(url, [matricule])).then(
            eObservations => {
                return this.eObservationTransformerService.toEObservations(eObservations);
            }
        );
    }

    /**
     * Met à jour une eObservation
     * @param eObservation l'eObservation à valider
     * @return une promesse contenant l'eObservation validée
     */
    public updateEObservation(eObservation: EObservationModel): Promise<EObservationModel> {
        return this.restService.post(this.config.getBackEndUrl('eObservations'), eObservation);
    }

    /**
     * Récupère une eObservation à partir de son id
     * @param id l'id de l'eObservation à récupérer
     * @return une promesse contenant l'eObservation récupérée
     */
    public getEObservation(id: number): Promise<EObservationModel> {
        return this.restService.get(this.config.getBackEndUrl('getEObservationById', [id]));
    }

    /**
     * Récupère les EObservations rédigés
     * @param matricule le matricule du rédacteur
     * @return une promesse contenant les EObservations rédigées
     */
    public findEObservationsByRedactor(matricule: string): Promise<EObservationModel[]> {
        return this.restServiceGetEObservations('getEObservationsByRedactorMatricule', matricule);
    }

    public getAllPcbReferentialItemLevelsByVersion(version: string): Promise<ReferentialItemLevelModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getAllPcbReferentialItemLevelsByVersion', [version]));
    }

}
