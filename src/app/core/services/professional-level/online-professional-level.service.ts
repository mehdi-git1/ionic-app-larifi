import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { ProfessionalLevelModel } from '../../models/professional-level/professional-level.model';

@Injectable({ providedIn: 'root' })
export class OnlineProfessionalLevelService {

    constructor(
        private restService: RestService,
        private config: UrlConfiguration) {
    }

    /**
     * Récupère le suivi réglementaire d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
     * @return le suivi réglementaire du PNC
     */
    getProfessionalLevel(matricule: string): Promise<ProfessionalLevelModel> {
        return this.restService.get(this.config.getBackEndUrl('getProfessionalLevelByMatricule', [matricule]));
    }
}
