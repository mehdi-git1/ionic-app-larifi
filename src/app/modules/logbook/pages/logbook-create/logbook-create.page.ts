import { Events } from 'ionic-angular';

import { Component, ViewChild } from '@angular/core';

import { LogbookEventModeEnum } from '../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { LogbookEventComponent } from '../../components/logbook-event/logbook-event.component';

@Component({
    selector: 'logbook-create',
    templateUrl: 'logbook-create.page.html',
})
export class LogbookCreatePage {

    logbookEvent: LogbookEventModel;
    originLogbookEvent: LogbookEventModel;

    LogbookEventModeEnum = LogbookEventModeEnum;

    logbookEventSaved = false;
    logbookEventCanceled = false;

    @ViewChild('logbookEventCreate') logbookEventCreate: LogbookEventComponent;

    constructor(private events: Events) {
        this.events.subscribe('LinkedLogbookEvent:saved', () => {
            this.logbookEventSaved = true;
        });
        this.events.subscribe('LinkedLogbookEvent:canceled', () => {
            this.logbookEventCanceled = true;
        });
    }

    ionViewCanLeave() {
        if (this.logbookEventSaved || this.logbookEventCanceled) {
            return true;
        }
        return this.logbookEventCreate.confirmCancel();
    }
}
