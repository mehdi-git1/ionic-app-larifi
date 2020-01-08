import { DwhHistoryModel } from '../../models/dwh-history/dwh-history.model';
import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable({ providedIn: 'root' })
export class OfflineDwhHistoryService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration
    ) { }

    /**
     * Récupère l'historique DWH du Pnc hors ligne
     * @param matricule matricule du Pnc
     * @return une promesse contenant null tant que l'historique DWH n'est pas disponible hors ligne
     */
    public getDwhHistory(matricule: string): Promise<DwhHistoryModel> {
        return Promise.resolve(null);
    }
}
