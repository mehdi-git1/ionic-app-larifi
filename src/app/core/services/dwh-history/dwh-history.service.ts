import { ConnectivityService } from './../connectivity/connectivity.service';
import { OfflineDwhHistoryService } from './offline-dwh-history.service';
import { OnlineDwhHistoryService } from './online-dwh-history.service';
import { DwhHistoryModel } from './../../models/dwh-history/dwh-history.model';
import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { BaseService } from '../base/base.service';

@Injectable({ providedIn: 'root' })
export class DwhHistoryService extends BaseService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration,
        public connectivityService: ConnectivityService,
        public onlineDwhHistoryService: OnlineDwhHistoryService,
        public offlineDwhHistoryService: OfflineDwhHistoryService
    ) { 
        super(
            connectivityService,
            onlineDwhHistoryService,
            offlineDwhHistoryService
        );
    }

    /**
     * Récupère l'historique DWH du Pnc
     * @param matricule matricule du Pnc
     * @return une promesse contenant l'historique DWH du Pnc
     */
    public getDwhHistory(matricule: string): Promise<DwhHistoryModel> {
        return this.execFunctionService('getDwhHistory', matricule);
    }
}
