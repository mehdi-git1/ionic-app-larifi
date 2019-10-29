import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { LogbookEventModel } from '../../models/logbook/logbook-event.model';
import { PncLightModel } from '../../models/pnc-light.model';
import { StorageService } from '../../storage/storage.service';
import { SessionService } from '../session/session.service';
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
        if (logbookEvent.techId === undefined) {
            logbookEvent.creationDate = new Date();
            logbookEvent.redactor = new PncLightModel();
            logbookEvent.redactor.matricule = this.sessionService.getActiveUser().matricule;
            logbookEvent.redactor.lastName = this.sessionService.getActiveUser().lastName;
            logbookEvent.redactor.firstName = this.sessionService.getActiveUser().firstName;
        } else {
            logbookEvent.lastUpdateAuthor = new PncLightModel();
            logbookEvent.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
            logbookEvent.lastUpdateDate = new Date();
        }
        return this.restService.post(this.config.getBackEndUrl('logbookEvents'), logbookEvent);
    }

    /**
     * Cache ou affiche un évènement dans le journal de bord d'un pnc
     * @param  logbookEvent l'évènement du journal de bord à afficher ou à cacher
     * @return une promesse contenant l'évènement du journal de bord à afficher ou à cacher
     */
    hideOrDisplay(logbookEvent: LogbookEventModel): Promise<LogbookEventModel> {
        return this.restService.put(this.config.getBackEndUrl('hideOrDisplayLogbookEvent', [logbookEvent.techId]), { hidden: logbookEvent.hidden, displayed: logbookEvent.displayed });
    }

    /**
     * Récupère le ou les évènements à partir de leur group id
     * @param id le group id du ou des évènements à récupérer
     * @return une promesse contenant le ou les évènements récupérés
     */
    public getLogbookEventsByGroupId(id: number): Promise<LogbookEventModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getLogbookEventsByGroupId', [id]));
    }

    /**
     * Récupère tout les évènements du journal de bord d'un pnc
     * @param matricule le matricule du PNC dont on souhaite récupérer les évènements du journal de bord
     * @return la liste des évènements du journal de bord
     */
    getLogbookEvents(matricule: string): Promise<LogbookEventModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getLogbookEvents', [matricule]));
    }

    /**
     * Supprime un évènement à partir de son id
     * @param id l'id de l'évènement à supprimer
     * @return une promesse contenant l'objectif supprimé
     */
    delete(id: number): Promise<LogbookEventModel> {
        return this.restService.delete(this.config.getBackEndUrl('deleteLogbookEventById', [id]));
    }
}
