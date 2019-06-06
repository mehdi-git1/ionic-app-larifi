import { SessionService } from './../../../../core/services/session/session.service';
import { OnlineLogbookEventService } from './../../../../core/services/logbook/online-logbook-event.service';
import { LogbookEventModel } from './../../../../core/models/logbook/logbook-event.model';
import { SecurityService } from './../../../../core/services/security/security.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { NavController, NavParams } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { LogbookEditPage } from '../logbook-edit/logbook-edit.page';

@Component({
    selector: 'page-logbook-event-details',
    templateUrl: 'logbook-event-details.page.html',
})
export class LogbookEventDetailsPage implements OnInit {

    private logbookEvents: LogbookEventModel[];
    pnc: PncModel;

    constructor(
        public navCtrl: NavController,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private navParams: NavParams,
        private sessionService: SessionService,
        private pncService: PncService
    ) {


    }

    ngOnInit() {
        let matricule = this.navParams.get('matricule');
        if (this.navParams.get('matricule')) {
            matricule = this.navParams.get('matricule');
        } else if (this.sessionService.getActiveUser()) {
            matricule = this.sessionService.getActiveUser().matricule;
        }
        if (matricule != null) {
            this.pncService.getPnc(matricule).then(pnc => {
                this.pnc = pnc;
                if (typeof this.navParams.get('groupId') !== 'undefined') {
                    const groupId = this.navParams.get('groupId');
                    this.onlineLogbookEventService.getLogbookEventsByGroupId(groupId).then(
                        logbookEvents => {
                            this.logbookEvents = logbookEvents.sort((a, b) => a.eventDate < b.eventDate ? 1 : -1);
                            this.logbookEvents.forEach(logbookEvent => {
                                logbookEvent.notifiedPncs.forEach(notifiedPnc => {
                                    if (pnc.pncInstructor && notifiedPnc.matricule === pnc.pncInstructor.matricule) {
                                        notifiedPnc.isInstructor = true;
                                    } else if (pnc.pncRds && notifiedPnc.matricule === pnc.pncRds.matricule) {
                                        notifiedPnc.isRds = true;
                                    }
                                });
                            });
                        });
                }
            }, error => { });
        }
    }


    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return true;
    }
}

