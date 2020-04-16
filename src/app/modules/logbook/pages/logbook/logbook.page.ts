import * as moment from 'moment';
import { ToastService } from 'src/app/core/services/toast/toast.service';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import { LogbookEventTypeEnum } from '../../../../core/enums/logbook-event/logbook-event-type.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { LogbookEventGroupModel } from '../../../../core/models/logbook/logbook-event-group.model';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import {
    OnlineLogbookEventService
} from '../../../../core/services/logbook/online-logbook-event.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { DateTransform } from '../../../../shared/utils/date-transform';
import {
    LogbookEventActionMenuComponent
} from '../../components/logbook-event-action-menu/logbook-event-action-menu.component';

@Component({
    selector: 'log-book',
    templateUrl: 'logbook.page.html',
    styleUrls: ['./logbook.page.scss']
})
export class LogbookPage {

    displayedLogbookEventsColumns: string[] =
        ['childEvents', 'eventDate', 'creationDate', 'category', 'important', 'attach', 'event', 'origin', 'author', 'actions'];
    pnc: PncModel;

    sortAscending = false;
    sortedColumn: string;

    groupedEvents: Array<LogbookEventGroupModel>;

    TabHeaderEnum = TabHeaderEnum;

    LogbookEventTypeEnum = LogbookEventTypeEnum;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private securityService: SecurityService,
        private sessionService: SessionService,
        private dateTransform: DateTransform,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private popoverCtrl: PopoverController,
        private connectivityService: ConnectivityService,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private toastService: ToastService,
        private loadingCtrl: LoadingController
    ) {
    }

    ionViewWillEnter() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        this.getLogbookEvents(this.pnc.matricule);
    }

    /**
     * Rafraîchit la page
     */
    refreshPage() {
        this.groupedEvents = null;
        this.getLogbookEvents(this.pnc.matricule);
    }

    /**
     * Verifie si l'évènement en paramètre est masqué pour le PNC concerné
     * @param logbookEvent l'évènement à tester
     */
    isHidden(logbookEvent: LogbookEventModel) {
        const now = moment();
        const broadcastDate = moment(logbookEvent.creationDate, AppConstant.isoDateFormat);
        const hiddenDuration = moment.duration(now.diff(broadcastDate)).asMilliseconds();
        const upToFifteenDays = moment.duration(15, 'days').asMilliseconds();
        if ((hiddenDuration < upToFifteenDays && !logbookEvent.displayed) || logbookEvent.hidden) {
            return true;
        }
        return false;
    }

    /**
     * Gère la réception des évènements du journal de bord du Pnc
     * @param matricule le matricule du Pnc
     */
    private getLogbookEvents(matricule: string) {
        this.onlineLogbookEventService.getLogbookEvents(matricule).then(logbookEvents => {
            // Tri des évènements par groupId
            this.groupedEvents = new Array<LogbookEventGroupModel>();
            const groupedEventsMap = new Map<number, LogbookEventGroupModel>();
            logbookEvents.forEach(logbookEvent => {
                if (this.sessionService.getActiveUser().isManager
                    || matricule === this.sessionService.getActiveUser().matricule
                    && !this.isHidden(logbookEvent)) {
                    if (!groupedEventsMap.has(logbookEvent.groupId)) {
                        groupedEventsMap.set(logbookEvent.groupId, new LogbookEventGroupModel(logbookEvent.groupId, this.dateTransform));
                    }
                    groupedEventsMap.get(logbookEvent.groupId).logbookEvents.push(logbookEvent);
                }
            });
            // Tri des events de chaque groupe par date d'évènement
            for (const groupedEvent of Array.from(groupedEventsMap.values())) {
                groupedEvent.logbookEvents = this.sortLogbookEventsByEventDate(groupedEvent.logbookEvents);
                this.groupedEvents.push(groupedEvent);
            }
        }, error => {
            this.groupedEvents = new Array<LogbookEventGroupModel>();
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
        return moment(event1.eventDate, AppConstant.isoDateFormat).isBefore(moment(event2.eventDate, AppConstant.isoDateFormat)) ? 1 : -1;
    }

    /**
     * Vérifie si il y a des évènements de journal de bord
     * @return true si il n'y a pas d'évènements, sinon false
     */
    hasLogbookEvents(): boolean {
        return !(this.groupedEvents === undefined || this.groupedEvents === null || this.groupedEvents.length === 0);
    }

    /**
     * Vérifie le groupe est composé de plusieurs évènements
     * @return true si il y a plusieurs d'évènements, sinon false
     */
    groupHasManyEvents(eventGroup: LogbookEventGroupModel): boolean {
        return !(eventGroup === undefined || eventGroup === null || eventGroup.logbookEvents.length <= 1);
    }

    /**
     * Ouvre ou ferme un bloc d'évènements liés
     * @param eventGroup groupe d'évènements de journal de bord
     */
    collapseOrExpandEventGroup(myEvent: Event, eventGroup: LogbookEventGroupModel) {
        myEvent.stopPropagation();
        eventGroup.expanded = !eventGroup.expanded;
    }

    /**
     * Dirige vers la page d'édition d'un évènement du journal de bord
     */
    goToLogbookCreation() {
        if (this.pnc) {
            this.router.navigate(['create'], { relativeTo: this.activatedRoute });
        }
    }

    /**
     * Dirige vers la page de détail d'un évènement du journal de bord
     */
    goToLogbookEventDetails(groupId: number) {
        this.router.navigate(['detail', groupId, false], { relativeTo: this.activatedRoute });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.groupedEvents && this.groupedEvents !== undefined;
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Ouvre la popover de description d'un item
     * @param event  event
     * @param logbookEvent l'évènement JDB concerné
     */
    openActionsMenu(event: Event, logbookEvent: LogbookEventModel, logbookEventIndex: number) {
        event.stopPropagation();
        this.popoverCtrl.create({
            component: LogbookEventActionMenuComponent,
            componentProps: {
                logbookEvent: logbookEvent,
                pnc: this.pnc,
                logbookEventIndex: logbookEventIndex
            },
            event: event,
            cssClass: 'action-menu-popover'
        }).then(popover => {
            popover.present();

            popover.onDidDismiss().then(dismissEvent => {
                if (dismissEvent.data === 'logbookEvent:create') {
                    this.router.navigate(['detail', logbookEvent.groupId, true], { relativeTo: this.activatedRoute });
                }
                if (dismissEvent.data === 'logbookEvent:update') {
                    this.router.navigate(['detail', logbookEvent.groupId, false], {
                        state: {
                            logbookEvent: logbookEvent
                        }
                        , relativeTo: this.activatedRoute
                    });
                }
                if (dismissEvent.data === 'logbookEvent:delete') {
                    this.confirmDeleteLogBookEvent(logbookEvent.techId);
                }
            });
        });
    }

    /**
     * Présente une alerte afin de confirmer la suppression de l'évènement
     */
    confirmDeleteLogBookEvent(logbookEventTechId: number) {
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
                    handler: () => this.deleteLogbookEvent(logbookEventTechId)
                }
            ]
        }).then(alert => alert.present());
    }

    /**
     * Supprime un évènement puis met à jour la liste d'évènement
     */
    deleteLogbookEvent(logbookEventTechId: number) {
        this.loadingCtrl.create().then(loading => {
            loading.present();

            this.onlineLogbookEventService.delete(logbookEventTechId)
                .then(deletedlogbookEvent => {
                    this.toastService.success(this.translateService.instant('LOGBOOK.DELETE.SUCCESS'));
                    this.getLogbookEvents(this.pnc.matricule);
                    loading.dismiss();
                },
                    error => {
                        loading.dismiss();
                    });
        });
    }

    /**
     * Vérifie si il y a des pièces jointes
     * @return true si il y a des pièces jointes, false sinon
     */
    logbookEventHasAttachments(logbookEvent: LogbookEventModel): boolean {
        return logbookEvent.attachmentFiles && logbookEvent.attachmentFiles.length > 0;
    }

    /**
     * Vérifie si on peut créer un évènement
     * @return true si on est Manager et qu'on est en ligne
     */
    isEventCreationAvailable(): boolean {
        return this.isManager() && this.connectivityService.isConnected();
    }

    /**
     * Vérifie si le lien Friendly doit être affiché
     * @return vrai si le lien Friendly doit être affiché, faux sinon
     */
    isFriendlyLinkAvailable() {
        return this.isManager() && this.connectivityService.isConnected();
    }

    /**
     * Vérifie que l'on est en mode connecté
     * @return true si on est en mode connecté, false sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }
}
