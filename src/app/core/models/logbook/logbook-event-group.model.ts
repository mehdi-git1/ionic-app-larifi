import { LogbookEventModel } from './logbook-event.model';
import { Serializable } from './../../../shared/utils/serializable';
import { PncLightModel } from './../pnc-light.model';
import { PncModel } from './../pnc.model';
import { LogbookEventCategory } from './logbook-event-category';
export class LogbookEventGroupModel extends Serializable {
    groupId: number;
    logbookEvents: LogbookEventModel[];
    expanded = true;
    constructor(groupId: number) {
        super();
        this.groupId = groupId;
        this.logbookEvents = new Array();
    }
}
