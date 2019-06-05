import { SessionService } from './../session/session.service';
import { PncLightModel } from './../../models/pnc-light.model';
import { LogbookEventModel } from './../../models/logbook/logbook-event.model';
import { EntityEnum } from './../../enums/entity.enum';
import { StorageService } from './../../storage/storage.service';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';

import { ProfessionalInterviewModel } from '../../models/professional-interview/professional-interview.model';
import { TransformerService } from '../transformer/transformer.service';

@Injectable()
export class OnlineLogbookEventService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration,
        public universalTransformer: TransformerService,
        private storageService: StorageService,
        private sessionService: SessionService
    ) { }

    /**
     * Créé ou met à jour un évènement du journal de bord
     * @param  logbookEvent l'évènement du journal de bord à créer ou mettre à jour
     * @return une promesse contenant l'évènement du journal de bord créé ou mis à jour
     */
    createOrUpdate(logbookEvent: LogbookEventModel): Promise<LogbookEventModel> {
        if (logbookEvent.id === undefined) {
            logbookEvent.creationDate = new Date();
        }
        logbookEvent.lastUpdateAuthor = new PncLightModel();
        logbookEvent.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
        logbookEvent.lastUpdateDate = new Date();
        return this.restService.post(this.config.getBackEndUrl('logbookEvents'), logbookEvent);
    }

}