import { LogbookEventCreateComponent } from './../../components/logbook-event-create.component.ts/logbook-event-create.component';
import { AppConstant } from './../../../../app.constant';
import { SessionService } from './../../../../core/services/session/session.service';
import { OnlineLogbookEventService } from './../../../../core/services/logbook/online-logbook-event.service';
import { LogbookEventModel } from './../../../../core/models/logbook/logbook-event.model';
import { SecurityService } from './../../../../core/services/security/security.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { NavController, NavParams } from 'ionic-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LogbookEditPage } from '../logbook-edit/logbook-edit.page';

@Component({
    selector: 'page-logbook-event-details',
    templateUrl: 'logbook-event-details.page.html',
})
export class LogbookEventDetailsPage implements OnInit {

    private logbookEvents: LogbookEventModel[];
    pnc: PncModel;
    createLinkedEvent = false;
    groupId: number;

    @ViewChild('logbookEventCreate') logbookEventCreate: LogbookEventCreateComponent;

    constructor(
        public navCtrl: NavController,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private navParams: NavParams,
        private sessionService: SessionService,
        private pncService: PncService
    ) {

    }

    ionViewDidLoad() {
        this.logbookEventCreate.logbookSavedEvent.subscribe(event => {
            if ( event != null ) {
                this.getLogbookEventsByGroupId(this.groupId, this.pnc);
            }
            this.createLinkedEvent = false;
        });
    }

    ionViewCanLeave() {
        if (!this.createLinkedEvent) {
            return true;
        }
        return this.logbookEventCreate.cancelEdition();
    }

    ngOnInit() {
        let matricule = this.navParams.get('matricule');
        if (this.navParams.get('matricule')) {
            matricule = this.navParams.get('matricule');
        } else if (this.sessionService.getActiveUser()) {
            matricule = this.sessionService.getActiveUser().matricule;
        }

        if (this.navParams.get('createLinkedEvent')) {
            this.createLinkedEvent = this.navParams.get('createLinkedEvent');
        } else {
            this.createLinkedEvent = false;
        }

        if (matricule != null) {
            this.pncService.getPnc(matricule).then(pnc => {
                this.pnc = pnc;
                if (typeof this.navParams.get('groupId') !== 'undefined') {
                    const groupId = this.navParams.get('groupId');
                    this.groupId = groupId;
                    this.getLogbookEventsByGroupId(this.groupId, this.pnc);
                }
            }, error => { });
        }

    }


    /**
     * Récupère les évènements du groupe
     * @param groupId identifiant du groupe
     * @param pnc pnc
     */
    getLogbookEventsByGroupId(groupId: number, pnc: PncModel) {
        this.onlineLogbookEventService.getLogbookEventsByGroupId(groupId).then(
            logbookEvents => {
                this.logbookEvents = this.sortLogbookEventsByEventDate(logbookEvents);
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

    /**
     * Tri d'une liste d'évènements de journal de bord
     * @param logbookEvents liste d'évènements de journal de bord
     * @return liste triée
     */
    sortLogbookEventsByEventDate(logbookEvents: LogbookEventModel[]): LogbookEventModel[] {
        return logbookEvents.sort((event1, event2) => {
            return this.sortByEventDate(event1, event2);
        });
    }

    /**
     * Comparaison de 2 évènements de journal de bord par date d'évènement
     * @param event1 1er évènement de journal de bord
     * @param event2 2eme évènement de journal de bord
     * @return 1 si le 1er évènement est avant le 2e, sinon -1
     */
    sortByEventDate(event1: LogbookEventModel, event2: LogbookEventModel): number {
        return event1.eventDate < event2.eventDate ? 1 : -1;
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return true;
    }
}

