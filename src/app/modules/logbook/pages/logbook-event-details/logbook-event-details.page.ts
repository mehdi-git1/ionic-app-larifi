import { OnlineLogbookEventService } from './../../../../core/services/logbook/online-logbook-event.service';
import { LogbookEventModel } from './../../../../core/models/logbook/logbook-event.model';
import { SecurityService } from './../../../../core/services/security/security.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { LogbookEditPage } from '../logbook-edit/logbook-edit.page';

@Component({
    selector: 'page-logbook-event-details',
    templateUrl: 'logbook-event-details.page.html',
})
export class LogbookEventDetailsPage {

    private logbookEvents: LogbookEventModel[];

    constructor(
        public navCtrl: NavController,
        private onlineLogbookEventService: OnlineLogbookEventService) {
        this.onlineLogbookEventService.getLogbookEvents(1).then(
            logbookEvents => {
                this.logbookEvents = logbookEvents.sort((a, b) => a.eventDate < b.eventDate ? 1 : -1);;
            });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return true;
    }
}

