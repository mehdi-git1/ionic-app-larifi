import { Serializable } from './../../../shared/utils/serializable';
import { PncLightModel } from './../pnc-light.model';
import { PncModel } from './../pnc.model';
import { LogbookEventCategory } from './logbook-event-category';
import { LogbookEventNotifiedEmail } from './logbook-notified-email.model';
export class LogbookEventModel extends Serializable {
    id: number;
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
    notifiedPncs: PncLightModel[];
    notifiedRecipients: LogbookEventNotifiedEmail[];
}
