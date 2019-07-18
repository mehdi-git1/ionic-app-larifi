import { ToastService } from './../../../../core/services/toast/toast.service';
import { LogbookEventComponent } from './../../components/logbook-event/logbook-event.component';
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
import { NavController, NavParams, Events, AlertController, Item, Loading, LoadingController } from 'ionic-angular';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { LogbookCreatePage } from '../logbook-create/logbook-create.page';
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
    loading: Loading;

    LogbookEventModeEnum = LogbookEventModeEnum;

    @ViewChildren('logbookEventDetails') logbookEventDetails: LogbookEventComponent[];

    @ViewChild('linkedLogbookEventCreate') linkedLogbookEventCreate: LogbookEventComponent;

    constructor(
        public navCtrl: NavController,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private navParams: NavParams,
        private sessionService: SessionService,
        private pncService: PncService,
        private events: Events,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private securityService: SecurityService,
        private toastService: ToastService,
        private loadingCtrl: LoadingController
    ) {
    }

    ngOnInit() {
        if (this.navParams.get('createLinkedEvent')) {
            this.createLinkedEvent = this.navParams.get('createLinkedEvent');
        }
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
        return new Promise((resolve, reject) => {
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
                    resolve();
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
        return this.logbookEvents !== undefined && this.logbookEvents !== null;
    }

    ionViewCanLeave() {
        if (this.logbookEventSaved || (!this.editionMode && !this.createLinkedEvent)) {
            return true;
        }
        let logbookEventComponent: LogbookEventComponent;
        if (this.createLinkedEvent) {
            logbookEventComponent = this.linkedLogbookEventCreate;
        } else {

            this.logbookEventDetails.forEach(logbookEvent => {
                if (logbookEvent.logbookEvent.techId === this.logbookEventTechId) {
                    logbookEventComponent = logbookEvent;
                }
            });
        }
        return logbookEventComponent.confirmCancel();
    }

    /**
     * Determine l'évènement à modifier ou à supprimer, et bloque la modification et la suppression des autres évènements liés.
     * @param logbookEvent L'évènement à modifier
     */
    selectedLogbookEvent(logbookEvent: LogbookEventModel) {
        if (logbookEvent.techId && !this.editionMode && !this.createLinkedEvent) {
            this.logbookEventTechId = logbookEvent.techId;
            this.logbookEventDetails.forEach(item => {
                if (item.logbookEvent.techId === logbookEvent.techId) {
                    if (logbookEvent.mode === LogbookEventModeEnum.DELETION) {
                        this.logbookEvent = logbookEvent;
                        this.confirmDeleteLogBookEvent();
                    } else if (logbookEvent.mode === LogbookEventModeEnum.EDITION) {
                        item.editEvent = true;
                        this.editionMode = true;
                    }
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
     * Présente une alerte pour confirmer la suppression du brouillon
     */
    confirmDeleteLogBookEvent() {
        this.alertCtrl.create({
            title: this.translateService.instant('LOGBOOK.DELETE.CONFIRM_DELETE.TITLE'),
            message: this.translateService.instant('LOGBOOK.DELETE.CONFIRM_DELETE.MESSAGE'),
            buttons: [
                {
                    text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
                    handler: () => this.deleteLogbookEvent()
                }
            ]
        }).present();
    }

    /**
    * Supprime un évènement
    */
    deleteLogbookEvent() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.onlineLogbookEventService.delete(this.logbookEvent.techId)
            .then(
                deletedlogbookEvent => {
                    this.toastService.success(this.translateService.instant('LOGBOOK.DELETE.SUCCESS'));
                    this.getLogbookEventsByGroupId(this.groupId, this.pnc).then(() => {
                        if (this.logbookEvents.length === 0) {
                            this.navCtrl.pop();
                        }
                    });
                    this.loading.dismiss();
                },
                error => {
                    this.loading.dismiss();
                });
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }
}

