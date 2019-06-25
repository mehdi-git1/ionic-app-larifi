import { LogbookEventDetailsComponent } from './../../components/logbook-event-details/logbook-event-details.component';
import { TranslateService } from '@ngx-translate/core';
import { TransformerService } from './../../../../core/services/transformer/transformer.service';
import { Utils } from './../../../../shared/utils/utils';
import { LogbookEventModeEnum } from './../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { AppConstant } from './../../../../app.constant';
import { SessionService } from './../../../../core/services/session/session.service';
import { OnlineLogbookEventService } from './../../../../core/services/logbook/online-logbook-event.service';
import { LogbookEventModel } from './../../../../core/models/logbook/logbook-event.model';
import { SecurityService } from './../../../../core/services/security/security.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { NavController, NavParams, Events, AlertController, Item } from 'ionic-angular';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { LogbookEditPage } from '../logbook-edit/logbook-edit.page';
import * as _ from 'lodash';

@Component({
    selector: 'page-logbook-event-details',
    templateUrl: 'logbook-event-details.page.html',
})
export class LogbookEventDetailsPage implements OnInit {

    private logbookEvents: LogbookEventModel[];
    pnc: PncModel;
    logbookEvent: LogbookEventModel;
    originLogbookEvent: LogbookEventModel;
    logbookEventSaved = false;

    createLinkedEvent = false;
    editionMode = false;
    groupId: number;
    logbookEventTechId: number;

    LogbookEventModeEnum = LogbookEventModeEnum;

    @ViewChildren('logbookEventDetails') logbookEventDetails: LogbookEventDetailsComponent[];

    @ViewChild('linkedLogbookEventCreate') linkedLogbookEventCreate: LogbookEventDetailsComponent;

    constructor(
        public navCtrl: NavController,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private navParams: NavParams,
        private sessionService: SessionService,
        private pncService: PncService,
        private events: Events,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private securityService: SecurityService
    ) {
    }

    ngOnInit() {
        this.createLinkedEvent = this.navParams.get('createLinkedEvent');
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }

        if (typeof this.navParams.get('groupId') !== 'undefined') {
            const groupId = this.navParams.get('groupId');
            this.groupId = groupId;
            this.getLogbookEventsByGroupId(this.groupId, this.pnc);
        }

        this.events.subscribe('LogbookEvent:saved', () => {
            this.logbookEventSaved = true;
            this.createLinkedEvent = false;
            this.logbookEventTechId = null;
            this.editionMode = false;
            this.getLogbookEventsByGroupId(this.groupId, this.pnc);
        });
        this.events.subscribe('LinkedLogbookEvent:canceled', () => {
            this.createLinkedEvent = false;
            this.logbookEventTechId = null;
            this.editionMode = false;
        });
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

    ionViewCanLeave() {
        if (this.logbookEventSaved || (!this.editionMode && !this.createLinkedEvent)) {
            return true;
        }
        let logbookEventDetailsComponent: LogbookEventDetailsComponent;
        if (this.createLinkedEvent) {
            logbookEventDetailsComponent = this.linkedLogbookEventCreate;
        } else {

            this.logbookEventDetails.forEach(logbookEvent => {
                if (logbookEvent.logbookEvent.techId === this.logbookEventTechId) {
                    logbookEventDetailsComponent = logbookEvent;
                }
            });
        }
        return logbookEventDetailsComponent.confirmCancel();
    }

    /**
     * Determine l'évènement a modifier, et bloque la modification des autres évènements liés.
     * @param logbookEvent L'évènement à modifier
     */
    selectedLogbookEvent(logbookEvent: LogbookEventModel) {
        if (!this.logbookEventTechId && !this.createLinkedEvent) {
            this.logbookEventTechId = logbookEvent.techId;
            this.logbookEventDetails.forEach(item => {
                if (item.logbookEvent.techId === logbookEvent.techId) {
                    item.editEvent = true;
                    this.editionMode = true;
                }
            });
        }
    }

    /**
     * Permet de créer un évènement lié.
     */
    createLinkedLogookEvent() {
        this.createLinkedEvent = true;
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }
}

