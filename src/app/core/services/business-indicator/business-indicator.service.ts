import { BusinessIndicatorFilterModel } from './../../models/business-indicator/business-indicator-filter-model';
import { PagedBusinessIndicatorModel } from './../../models/business-indicator/paged-businessIndicator.model';
import { OnlineBusinessIndicatorService } from './online-business-indicator.service';
import { OfflineBusinessIndicatorService } from './offline-business-indicator.service';
import { ConnectivityService } from './../connectivity/connectivity.service';
import { Injectable } from '@angular/core';

import {
    BusinessIndicatorLightModel
} from '../../models/business-indicator/business-indicator-light.model';
import {
    BusinessIndicatorSummaryModel
} from '../../models/business-indicator/business-indicator-summary.model';
import { BusinessIndicatorModel } from '../../models/business-indicator/business-indicator.model';
import { BaseService } from '../base/base.service';

@Injectable()
export class BusinessIndicatorService extends BaseService {

    constructor(
        public connectivityService: ConnectivityService,
        private onlineBusinessIndicatorService: OnlineBusinessIndicatorService,
        private offlineBusinessIndicatorService: OfflineBusinessIndicatorService
    ) {
        super(
            connectivityService,
            onlineBusinessIndicatorService,
            offlineBusinessIndicatorService
        );
    }

    /**
     * Récupère les indicateurs métier du Pnc
     * @param matricule le matricule du Pnc
     * @param filters les filtres à appliquer à la requete
     * 
     * @return Les indicateurs métiers du PNC
     */
    findPncBusinessIndicators(matricule: string, filters: BusinessIndicatorFilterModel): Promise<PagedBusinessIndicatorModel> {
        return this.execFunctionService('findPncBusinessIndicators', matricule, filters);
    }

    /**
     * Récupère la synthèse des indicateurs métier des 6 derniers mois d'un PNC
     *
     * @param matricule
     *            le matricule du Pnc
     * @return la synthèse des indicateurs métier des 6 derniers mois
     */
    getBusinessIndicatorSummary(matricule: string): Promise<BusinessIndicatorSummaryModel> {
        return this.execFunctionService('getBusinessIndicatorSummary', matricule);
    }

    /**
     * Récupère un indicateur métier
     * @param id l'id de l'indicateur métier à récupérer
     * @return l'indicateur métier trouvé
     */
    getBusinessIndicator(id: number): Promise<BusinessIndicatorModel> {
        return this.execFunctionService('getBusinessIndicator', id);
    }

}
