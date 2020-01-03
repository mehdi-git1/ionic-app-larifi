import { ConnectivityService } from './../connectivity/connectivity.service';
import { OfflineHrDocumentService } from './offline-hr-document.service';
import { OnlineHrDocumentService } from './online-hr-document.service';
import { Injectable } from '@angular/core';
import { HrDocumentFilterModel } from '../../models/hr-document-filter.model';
import { HrDocumentModel } from '../../models/hr-document/hr-document.model';
import { PagedHrDocumentModel } from '../../models/paged-hr-document.model';
import { BaseService } from '../base/base.service';

@Injectable()
export class HrDocumentService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineHrDocumentService: OnlineHrDocumentService,
        private offlineHrDocumentService: OfflineHrDocumentService
    ) {
        super(connectivityService,
            onlineHrDocumentService,
            offlineHrDocumentService);
    }

    /**
     * Créé ou met à jour un document RH
     * @param  hrDocument Le document RH à créer ou mettre à jour
     * @return une promesse contenant Le document RH créé ou mis à jour
     */
    createOrUpdate(hrDocument: HrDocumentModel): Promise<HrDocumentModel> {
        return this.execFunctionService('createOrUpdate', hrDocument);
    }

    /**
     * Récupère un document RH
     * @param id l'id du document à récupérer
     * @return le document récupéré
     */
    getHrDocument(id: number): Promise<HrDocumentModel> {
        return this.execFunctionService('getHrDocument', id);
    }

    /**
     * Récupère les documents RH d'un pnc
     * @param matricule le matricule du PNC dont on souhaite récupérer les documents RH
     * @return la liste des documents RH
     */
    getHrDocumentPageByFilter(hrdocumentSearch: HrDocumentFilterModel): Promise<PagedHrDocumentModel> {
        return this.execFunctionService('getHrDocumentPageByFilter', hrdocumentSearch);
    }
}
