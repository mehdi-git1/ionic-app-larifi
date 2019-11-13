import { Component, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';

import { LogbookEventModeEnum } from '../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { FormCanDeactivate } from '../../../../routing/guards/form-changes.guard';
import { LogbookEventComponent } from '../../components/logbook-event/logbook-event.component';

@Component({
    selector: 'logbook-create',
    templateUrl: 'logbook-create.page.html',
    styleUrls: ['./logbook-create.page.scss']
})
export class LogbookCreatePage {

    logbookEvent: LogbookEventModel;
    originLogbookEvent: LogbookEventModel;

    pnc: PncModel;

    LogbookEventModeEnum = LogbookEventModeEnum;

    logbookEventSaved = false;
    logbookEventCanceled = false;

    @ViewChild('logbookEventCreate', { static: false }) logbookEventCreate: LogbookEventComponent;

    constructor(
        private events: Events) {
        this.events.subscribe('LinkedLogbookEvent:saved', () => {
            this.logbookEventSaved = true;
        });
        this.events.subscribe('LinkedLogbookEvent:canceled', () => {
            this.logbookEventCanceled = true;
        });
    }
    canDeactivate(): boolean {
        if (this.logbookEventSaved || this.logbookEventCanceled) {
            return true;
        }
        return false;
    }

}
