import { LogbookEventModeEnum } from '../../enums/logbook-event/logbook-event-mode.enum';
import { DocumentModel } from '../document.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncLightModel } from '../pnc-light.model';
import { LogbookEventCategory } from './logbook-event-category';
import { LogbookEventNotifiedEmail } from './logbook-event-notified-email.model';

export class LogbookEventModel extends EDossierPncObjectModel {
    pnc: PncLightModel;
    redactor: PncLightModel;
    eventDate: string;
    creationDate: Date;
    lastUpdateDate: Date;
    lastUpdateAuthor: PncLightModel;
    pncInitiator: boolean;
    important: boolean;
    hidden: boolean;
    category: LogbookEventCategory;
    title: string;
    content: string;
    groupId: number;
    notifiedPncs: PncLightModel[];
    notifiedRecipients: LogbookEventNotifiedEmail[];
    attachmentFiles: Array<DocumentModel> = new Array();
    mode: LogbookEventModeEnum;
    type: string;
    ccoGroupId: number;

    getStorageId(): string {
        return `${this.techId}`;
    }

}
