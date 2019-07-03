import { DocumentModel } from './../../models/document.model';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';

@Injectable()
export class DocumentService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration
    ) { }

    /**
     * Récupère une eObservation à partir de son id
     * @param id l'id de l'eObservation à récupérer
     * @return une promesse contenant l'eObservation récupérée
     */
    public getDocument(documentId: number): Promise<DocumentModel> {
        return this.restService.get(this.config.getBackEndUrl('getDocumentById', [documentId]));
    }

}
