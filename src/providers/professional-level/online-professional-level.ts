
import { Injectable } from '@angular/core';

import { Config } from './../../configuration/environment-variables/config';
import { ProfessionalLevel } from './../../models/professionalLevel/professional-level';
import { RestService } from '../../services/rest/rest.base.service';

@Injectable()
export class OnlineProfessionalLevelProvider {

    constructor(public restService: RestService,
        public config: Config) {
    }

    /**
     * Récupère le suivi réglementaire d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
     * @return le suivi réglementaire du PNC
     */
    getProfessionalLevel(matricule: string): Promise<ProfessionalLevel> {
        return this.restService.get(this.config.getBackEndUrl('getProfessionalLevelByMatricule', [matricule]));
    }
}
