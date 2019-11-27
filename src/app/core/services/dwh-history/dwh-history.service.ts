import { DwhHistoryModel } from './../../models/dwh-history/dwh-history.model';
import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable({ providedIn: 'root' })
export class DwhHistoryService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration
    ) { }

    /**
     * Récupère l'historique DWH du Pnc
     * @param matricule matricule du Pnc
     * @return une promesse contenant l'historique DWH du Pnc
     */
    public getDwhHistory(matricule: string): Promise<DwhHistoryModel> {
        return this.restService.get(this.config.getBackEndUrl('getDwhHistory', [matricule]));
    }
}
