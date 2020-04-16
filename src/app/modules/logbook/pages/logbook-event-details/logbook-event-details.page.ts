import * as _ from 'lodash';
import * as moment from 'moment';

import {
    AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Events, LoadingController, NavController } from '@ionic/angular';
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
export class LogbookEventDetailsPage implements OnInit, AfterViewInit {

    logbookEvents: LogbookEventModel[];
    pnc: PncModel;
    logbookEvent: LogbookEventModel;
    originLogbookEvent: LogbookEventModel;
    logbookEventSaved = false;
    logbookEventCanceled = false;

    createLinkedEvent = false;
    isEditionMode = false;
    groupId: number;
    logbookEventTechId: number;

    currentNavigation;
    logbookEventToUpdate: LogbookEventModel;

    LogbookEventModeEnum = LogbookEventModeEnum;

    @ViewChildren('logbookEventCreate') logbookEventCreateComponent: LogbookEventComponent[];

    @ViewChildren('logbookEventDetails', { read: LogbookEventDetailsComponent })
    logbookEventDetailsComponent: QueryList<LogbookEventDetailsComponent>;

    @ViewChild('linkedLogbookEventCreate', { static: false }) linkedLogbookEventCreateComponent: LogbookEventComponent;

    selectedLogbookEventComponent: LogbookEventComponent;

    constructor(
        private navCtrl: NavController,
        private activatedRoute: ActivatedRoute,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private sessionService: SessionService,
        private events: Events,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private securityService: SecurityService,
        private toastService: ToastService,
        private loadingCtrl: LoadingController,
        private router: Router
    ) { }

    ngAfterViewInit() {
        this.currentNavigation = this.router.getCurrentNavigation();
        this.onlineLogbookEventService.getLogbookEventsByGroupId(this.groupId).then(logbookEvent => {
            if (this.currentNavigation.extras.state) {
                this.logbookEventToUpdate = this.currentNavigation.extras.state.logbookEvent;
                this.handleLogbookEventUpdateOrDelete(this.logbookEventToUpdate);
            }
        });
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
            this.isEditionMode = false;
            this.getLogbookEventsByGroupId(this.groupId, this.pnc);
        });
        this.events.subscribe('LogbookEvent:canceled', () => {
            this.logbookEventCanceled = true;
            this.createLinkedEvent = false;
            this.logbookEventTechId = null;
            this.isEditionMode = false;
        });
    }

    /**
     * Vérifie si l'on peut quitter la page
     * @return true si l'event lié est sauvegardé ou annulé
     */
    canDeactivate(): boolean {
        if (this.linkedLogbookEventCreateComponent === undefined) {
            return true;
        }
        return !this.linkedLogbookEventCreateComponent.formHasBeenModified();
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
                        if (this.sessionService.getActiveUser().isManager
                            || pnc.matricule === this.sessionService.getActiveUser().matricule
                            && !this.isHidden(logbookEvent)) {
                            this.logbookEvents.push(logbookEvent);
                        }
                    });
                    if (this.logbookEvents.length > 0) {
                        this.logbookEvents = this.sortLogbookEventsByEventDate(this.logbookEvents);
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
        if (logbookEvent.type !== LogbookEventTypeEnum.EDOSPNC) {
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

    /**
     * Gère l'évènement à modifier ou à supprimer, et bloque la modification et la suppression des autres évènements liés.
     * @param logbookEvent L'évènement à modifier
     */
    handleLogbookEventUpdateOrDelete(logbookEvent: LogbookEventModel) {
        if (logbookEvent.techId && !this.isEditionMode && !this.createLinkedEvent) {
            this.logbookEventTechId = logbookEvent.techId;
            this.logbookEventDetailsComponent.forEach(logBookEventDetail => {
                if (logBookEventDetail.logbookEvent.techId === logbookEvent.techId) {
                    if (logbookEvent.mode === LogbookEventModeEnum.DELETION) {
                        this.logbookEvent = logbookEvent;
                        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
                        this.confirmDeleteLogBookEvent();
                    } else if (logbookEvent.mode === LogbookEventModeEnum.EDITION) {
                        logBookEventDetail.editEvent = true;
                        this.isEditionMode = true;
                    }
                }
            });

            this.displayLogbookEventToUpdate(logbookEvent);
        }
    }

    /**
     * Affiche le formulaire de modification d'un évènement
     * @param logbookEvent l'évènement à modifier
     */
    displayLogbookEventToUpdate(logbookEvent: LogbookEventModel) {
        this.logbookEventCreateComponent.forEach(logbookEventCreate => {
            if (logbookEventCreate.logbookEvent.techId === logbookEvent.techId && logbookEvent.mode === LogbookEventModeEnum.EDITION) {
                this.selectedLogbookEventComponent = logbookEventCreate;
                logbookEventCreate.editEvent = true;
                logbookEventCreate.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

            }
        });
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
                            this.navCtrl.pop();
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

