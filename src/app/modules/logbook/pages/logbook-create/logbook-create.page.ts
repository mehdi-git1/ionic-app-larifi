import { Component, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';

import { LogbookEventModeEnum } from '../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { Utils } from '../../../../shared/utils/utils';
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

    ionViewCanLeave() {
        if (this.logbookEventSaved || this.logbookEventCanceled) {
            return true;
        }
        return this.logbookEventCreate.confirmCancel();
    }

    /**
     * Vérifie si le formulaire a été modifié sans être enregistré
     * @return true si il n'y a pas eu de modifications
     */
    formHasBeenModified() {
        return this.logbookEvent.eventDate != this.originLogbookEvent.eventDate
            || Utils.getHashCode(this.originLogbookEvent) !== Utils.getHashCode(this.logbookEvent);
    }
}
