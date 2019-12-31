import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import {
    BusinessIndicatorLightModel
} from '../../models/business-indicator/business-indicator-light.model';
import {
    BusinessIndicatorSummaryModel
} from '../../models/business-indicator/business-indicator-summary.model';
import { BusinessIndicatorModel } from '../../models/business-indicator/business-indicator.model';

@Injectable()
export class OnlineBusinessIndicatorService {

    constructor(
        private restService: RestService,
        private config: UrlConfiguration,
    ) { }

    /**
     * Récupère les indicateurs métier du Pnc
     * @param matricule le matricule du Pnc
     * @return Les indicateurs métiers du PNC
     */
    findPncBusinessIndicators(matricule: string): Promise<BusinessIndicatorLightModel[]> {
        return this.restService.get(this.config.getBackEndUrl('findPncBusinessIndicators', [matricule]));
    }

    /**
     * Récupère la synthèse des indicateurs métier des 6 derniers mois d'un PNC
     *
     * @param matricule
     *            le matricule du Pnc
     * @return la synthèse des indicateurs métier des 6 derniers mois
     */
    getBusinessIndicatorSummary(matricule: string): Promise<BusinessIndicatorSummaryModel> {
        return this.restService.get(this.config.getBackEndUrl('getBusinessIndicatorSummary', [matricule]));
    }

    /**
     * Récupère un indicateur métier
     * @param id l'id de l'indicateur métier à récupérer
     * @return l'indicateur métier trouvé
     */
    getBusinessIndicator(id: string): Promise<BusinessIndicatorModel> {
        return this.restService.get(this.config.getBackEndUrl('getBusinessIndicator', [id]));
    }

}
