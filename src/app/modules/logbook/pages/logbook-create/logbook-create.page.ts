import { Component, ViewChild } from '@angular/core';

import { LogbookEventModeEnum } from '../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { Events } from '../../../../core/services/events/events.service';
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
        this.events.subscribe('LogbookEvent:saved', () => {
            this.logbookEventSaved = true;
        });
        this.events.subscribe('LogbookEvent:canceled', () => {
            this.logbookEventCanceled = true;
        });
    }

    /**
     * Vérifie si l'on peut quitter la page
     * @return true si l'event est sauvegardé ou annulé
     */
    canDeactivate(): boolean {
        if (this.logbookEventSaved || this.logbookEventCanceled) {
            return true;
        }
        return !this.logbookEventCreate.formHasBeenModified();
    }

}
