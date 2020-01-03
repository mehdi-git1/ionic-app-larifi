import { PagedHrDocumentModel } from './../../models/paged-hr-document.model';
import { HrDocumentFilterModel } from './../../models/hr-document-filter.model';
import { HrDocumentModel } from './../../models/hr-document/hr-document.model';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineHrDocumentService {

    constructor() {}

    /**
     * Créé ou met à jour un document RH
     * @param  hrDocument Le document RH à créer ou mettre à jour
     * @return une promesse contenant Le document RH créé ou mis à jour
     */
    createOrUpdate(hrDocument: HrDocumentModel): Promise<HrDocumentModel> {
        return Promise.reject(null);
    }

    /**
     * Récupère un document RH
     * @param id l'id du document à récupérer
     * @return le document récupéré
     */
    getHrDocument(id: number): Promise<HrDocumentModel> {
        return Promise.resolve(null);
    }

    /**
     * Récupère les documents RH d'un pnc
     * @param matricule le matricule du PNC dont on souhaite récupérer les documents RH
     * @return la liste des documents RH
     */
    getHrDocumentPageByFilter(hrdocumentSearch: HrDocumentFilterModel): Promise<PagedHrDocumentModel> {
        return Promise.resolve(null);
    }
}
