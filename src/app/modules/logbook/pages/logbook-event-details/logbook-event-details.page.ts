

import * as _ from 'lodash';
import * as moment from 'moment';

import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Events, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import { LogbookEventModeEnum } from '../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventTypeEnum } from '../../../../core/enums/logbook-event/logbook-event-type.enum';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineLogbookEventService
} from '../../../../core/services/logbook/online-logbook-event.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import {
    LogbookEventDetailsComponent
} from '../../components/logbook-event-details/logbook-event-details.component';
import { LogbookEventComponent } from '../../components/logbook-event/logbook-event.component';

@Component({
    selector: 'page-logbook-event-details',
    templateUrl: 'logbook-event-details.page.html',
    styleUrls: ['./logbook-event-details.page.scss']
})
export class LogbookEventDetailsPage implements OnInit {

    logbookEvents: LogbookEventModel[];
    pnc: PncModel;
    logbookEvent: LogbookEventModel;
    originLogbookEvent: LogbookEventModel;
    logbookEventSaved = false;
    logbookEventCanceled = false;

    createLinkedEvent = false;
    editionMode = false;
    groupId: number;
    logbookEventTechId: number;

    LogbookEventModeEnum = LogbookEventModeEnum;

    @ViewChildren('logbookEventCreate') logbookEventCreate: LogbookEventComponent[];

    @ViewChildren('logbookEventDetails') logbookEventDetails: LogbookEventDetailsComponent[];

    @ViewChild('linkedLogbookEventCreate', { static: false }) linkedLogbookEventCreate: LogbookEventComponent;

    selectedLogbookEventComponent: LogbookEventComponent;

    constructor(
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private sessionService: SessionService,
        private events: Events,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private securityService: SecurityService,
        private toastService: ToastService,
        private loadingCtrl: LoadingController
    ) {
    }

    ngOnInit() {
        if (this.activatedRoute.snapshot.paramMap.get('createLinkedEvent')) {
            this.createLinkedEvent = this.activatedRoute.snapshot.paramMap.get('createLinkedEvent') === 'true' ? true : false;
        }
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }

        if (typeof this.activatedRoute.snapshot.paramMap.get('groupId') !== 'undefined') {
            this.groupId = parseInt(this.activatedRoute.snapshot.paramMap.get('groupId'), 10);
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
            this.logbookEventCanceled = true;
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
                    this.logbookEvents = new Array();
                    logbookEvents.forEach(logbookEvent => {
                        if (this.sessionService.getActiveUser().isManager || pnc.matricule === this.sessionService.getActiveUser().matricule && !this.isHidden(logbookEvent)) {
                            this.logbookEvents.push(logbookEvent);
                        }
                    });
                    if (this.logbookEvents.length > 0) {
                        this.logbookEvents = this.sortLogbookEventsByEventDate(this.logbookEvents);
                        this.logbookEvents.forEach(logbookEvent => {
                            logbookEvent.notifiedPncs.forEach(notifiedPnc => {
                                if (pnc.pncInstructor && notifiedPnc.matricule === pnc.pncInstructor.matricule) {
                                    notifiedPnc.isInstructor = true;
                                } else if (pnc.pncRds && notifiedPnc.matricule === pnc.pncRds.matricule) {
                                    notifiedPnc.isRds = true;
                                }
                            });
                        });
                    }
                    resolve();
                });
        });
    }

    /**
     * Verifie si l'évènement en paramètre est masqué pour le PNC concerné
     * @param logbookEvent l'évènement à tester
     */
    isHidden(logbookEvent: LogbookEventModel) {
        if (logbookEvent.type != LogbookEventTypeEnum.EDOSPNC) {
            const now = moment();
            const broadcastDate = moment(logbookEvent.creationDate, AppConstant.isoDateFormat);
            const hiddenDuration = moment.duration(now.diff(broadcastDate)).asMilliseconds();
            const upToFifteenDays = moment.duration(15, 'days').asMilliseconds();
            if ((hiddenDuration < upToFifteenDays && !logbookEvent.displayed) || logbookEvent.hidden) {
                return true;
            }
        }
        return false;
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
        if (this.logbookEventSaved || this.logbookEventCanceled) {
            return true;
        }
        if (this.createLinkedEvent) {
            return this.linkedLogbookEventCreate.confirmCancel();
        }
        return this.selectedLogbookEventComponent ? this.selectedLogbookEventComponent.confirmCancel() : true;
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
                        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
                        this.confirmDeleteLogBookEvent();
                    } else if (logbookEvent.mode === LogbookEventModeEnum.EDITION) {
                        item.editEvent = true;
                        this.editionMode = true;
                    }
                }
            });
            this.logbookEventCreate.forEach(item => {
                if (item.logbookEvent.techId === logbookEvent.techId && logbookEvent.mode === LogbookEventModeEnum.EDITION) {
                    this.selectedLogbookEventComponent = item;
                    item.editEvent = true;
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
            header: this.translateService.instant('LOGBOOK.DELETE.CONFIRM_DELETE.TITLE'),
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
        }).then(alert => alert.present());
    }

    /**
     * Supprime un évènement
     */
    deleteLogbookEvent() {
        this.loadingCtrl.create().then(loading => {
            loading.present();

            this.onlineLogbookEventService.delete(this.logbookEvent.techId)
                .then(deletedlogbookEvent => {
                    this.toastService.success(this.translateService.instant('LOGBOOK.DELETE.SUCCESS'));
                    this.getLogbookEventsByGroupId(this.groupId, this.pnc).then(() => {
                        if (this.logbookEvents.length === 0) {
                            this.location.back();
                        }
                    });
                    loading.dismiss();
                },
                    error => {
                        loading.dismiss();
                    });
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

