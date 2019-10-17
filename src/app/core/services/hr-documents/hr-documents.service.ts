import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { HrDocumentModel } from '../../models/hr-document/hr-document.model';
import { PncLightModel } from '../../models/pnc-light.model';
import { SessionService } from '../session/session.service';
import { TransformerService } from '../transformer/transformer.service';

@Injectable()
export class OnlineHrDocumentsService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration,
        public universalTransformer: TransformerService,
        private sessionService: SessionService
    ) { }

    /**
     * Créé ou met à jour un document RH
     * @param  hrDocument Le document RH à créer ou mettre à jour
     * @return une promesse contenant Le document RH créé ou mis à jour
     */
    createOrUpdate(hrDocument: HrDocumentModel): Promise<HrDocumentModel> {
        if (hrDocument.techId === undefined) {
            hrDocument.creationDate = new Date();
            hrDocument.redactor = new PncLightModel();
            hrDocument.redactor.matricule = this.sessionService.getActiveUser().matricule;
            hrDocument.redactor.lastName = this.sessionService.getActiveUser().lastName;
            hrDocument.redactor.firstName = this.sessionService.getActiveUser().firstName;
        } else {
            hrDocument.lastUpdateAuthor = new PncLightModel();
            hrDocument.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
            hrDocument.lastUpdateDate = new Date();
        }
        return this.restService.post(this.config.getBackEndUrl('hrDocuments'), hrDocument);
    }
}
