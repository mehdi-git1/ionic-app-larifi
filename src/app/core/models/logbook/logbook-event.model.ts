import { DocumentModel } from './../document.model';
import { LogbookEventNotifiedEmail } from './logbook-event-notified-email.model';
import { PncLightModel } from './../pnc-light.model';
import { PncModel } from './../pnc.model';
import { LogbookEventCategory } from './logbook-event-category';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
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
    lightAttachmentFiles: Array<DocumentModel> = new Array();

    getStorageId(): string {
        return `${this.techId}`;
    }

}
