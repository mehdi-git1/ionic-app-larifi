import { Injectable } from '@angular/core';

import {
    BusinessIndicatorLightModel
} from '../../models/business-indicator/business-indicator-light.model';
import {
    BusinessIndicatorSummaryModel
} from '../../models/business-indicator/business-indicator-summary.model';
import { BusinessIndicatorModel } from '../../models/business-indicator/business-indicator.model';

@Injectable()
export class OfflineBusinessIndicatorService {

    constructor() {}
    /**
     * Récupère les indicateurs métier du Pnc
     * @param matricule le matricule du Pnc
     * @return une promesse null car Les indicateurs métiers du PNC sont indisponibles hors ligne
     */
    findPncBusinessIndicators(matricule: string): Promise<BusinessIndicatorLightModel[]> {
        return Promise.resolve(new Array());
    }

    /**
     * Récupère la synthèse des indicateurs métier des 6 derniers mois d'un PNC
     *
     * @param matricule
     *            le matricule du Pnc
     * @return  une promesse null car Les indicateurs métiers du PNC sont indisponibles hors ligne
     */
    getBusinessIndicatorSummary(matricule: string): Promise<BusinessIndicatorSummaryModel> {
        return Promise.resolve(null);
    }

    /**
     * Récupère un indicateur métier
     * @param id l'id de l'indicateur métier à récupérer
     * @return une promesse null car Les indicateurs métiers du PNC sont indisponibles hors ligne
     */
    getBusinessIndicator(id: number): Promise<BusinessIndicatorModel> {
        return Promise.resolve(null);
    }

}
