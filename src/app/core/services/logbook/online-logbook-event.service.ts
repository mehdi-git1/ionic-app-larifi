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
            logbookEvent.redactor = new PncLightModel();
            logbookEvent.redactor.matricule = this.sessionService.getActiveUser().matricule;
            logbookEvent.redactor.lastName = this.sessionService.getActiveUser().lastName;
            logbookEvent.redactor.firstName = this.sessionService.getActiveUser().firstName;
        }
        logbookEvent.lastUpdateAuthor = new PncLightModel();
        logbookEvent.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
        logbookEvent.lastUpdateDate = new Date();
        return this.restService.post(this.config.getBackEndUrl('logbookEvents'), logbookEvent);
    }

    /**
     * Récupère l'évènement à partir de son id
     * @param id l'id de l'évènement parent
     * @return une promesse contenant l'évènement récupéré
     */
    public getLogbookEventById(id: number): Promise<LogbookEventModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getLogbookEventById', [id]));
    }

    /**
     * Récupère l'évènement du journal de bord'
     * @param matricule le matricule du PNC dont on souhaite récupérer l'évènement du journal de bord'
     * @return l'évènement du journal de bord'
     */
    getLogbookEvents(matricule: string): Promise<LogbookEventModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getLogbookEvents', [matricule]));
    }
}
