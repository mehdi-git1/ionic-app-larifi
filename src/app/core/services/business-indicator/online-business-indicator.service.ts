import { BusinessIndicatorModel } from './../../models/business-indicator/business-indicator.model';
import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { HrDocumentFilterModel } from '../../models/hr-document-filter.model';
import { HrDocumentModel } from '../../models/hr-document/hr-document.model';
import { PagedHrDocumentModel } from '../../models/paged-hr-document.model';
import { PncLightModel } from '../../models/pnc-light.model';
import { SessionService } from '../session/session.service';
import { TransformerService } from '../transformer/transformer.service';

@Injectable()
export class OnlineBusinessIndicatorService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration,
        public universalTransformer: TransformerService,
        private sessionService: SessionService
    ) { }

    /**
     * Récupère un document RH
     * @param id l'id du document à récupérer
     * @return le document récupéré
     */
    getBusinessIndicator(matricule: string): Promise<BusinessIndicatorModel> {
        return this.restService.get(this.config.getBackEndUrl('getLast6MonthsBusinessIndicators', [matricule]));
    }

}
