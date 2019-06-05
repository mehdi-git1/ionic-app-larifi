import { DateTransform } from './../../../shared/utils/date-transform';
import { AppConstant } from './../../../app.constant';
import { LogbookEventModel } from './logbook-event.model';
import { Serializable } from './../../../shared/utils/serializable';
import { PncLightModel } from './../pnc-light.model';
import { PncModel } from './../pnc.model';
import { LogbookEventCategory } from './logbook-event-category';
import * as moment from 'moment';

export class LogbookEventGroupModel extends Serializable {
    groupId: number;
    logbookEvents: LogbookEventModel[];
    expanded = true;
    constructor(groupId: number, dateTransform: DateTransform) {
        super();
        this.groupId = groupId;
        this.logbookEvents = new Array();
    }

    get eventDate(): string {
        return this.logbookEvents.sort((event1, event2) => {
            return moment(event1.eventDate, AppConstant.isoDateFormat).isBefore(moment(event2.eventDate, AppConstant.isoDateFormat)) ? 1 : -1;
        })[0].eventDate;
    }

    get creationDate(): Date {
        return this.logbookEvents.sort((event1, event2) => {
            return moment(event1.creationDate, AppConstant.isoDateFormat).isBefore(moment(event2.creationDate, AppConstant.isoDateFormat)) ? 1 : -1;
        })[0].creationDate;
    }

    get category(): string {
        return this.logbookEvents.sort((event1, event2) => {
            return event1.category.label.toLocaleLowerCase() < event2.category.label.toLocaleLowerCase() ? 1 : -1;
        })[0].category.label.toLocaleLowerCase();
    }

    get event(): string {
        return this.logbookEvents.sort((event1, event2) => {
            return event1.title.toLocaleLowerCase() < event2.title.toLocaleLowerCase() ? 1 : -1;
        })[0].title;
    }

    get author(): string {
        return this.logbookEvents.sort((event1, event2) => {
            return event1.lastUpdateAuthor.firstName.toLocaleLowerCase() < event2.lastUpdateAuthor.firstName.toLocaleLowerCase() ? 1 : -1;
        })[0].lastUpdateAuthor.firstName;
    }

    get origin(): boolean {
        return this.logbookEvents.sort((event1, event2) => {
            return event1.pncInitiator < event2.pncInitiator ? 1 : -1;
        })[0].pncInitiator;
    }
}
