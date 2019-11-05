import * as moment from 'moment';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { Config } from '../../../../../environments/config';
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
        private config: Config
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
     * Gère la réception des évènements du journal de bord du Pnc
     * @param logbookEvents evènements du journal de bord
     * @param matricule le matricule du Pnc
     */
    private getLogbookEvents(matricule: string) {
        this.onlineLogbookEventService.getLogbookEvents(matricule).then(logbookEvents => {
            // Tri des évènements par groupId
            this.groupedEvents = new Array<LogbookEventGroupModel>();
            const groupedEventsMap = new Map<number, LogbookEventGroupModel>();
            logbookEvents.forEach(logbookEvent => {
                if (!groupedEventsMap.has(logbookEvent.groupId)) {
                    groupedEventsMap.set(logbookEvent.groupId, new LogbookEventGroupModel(logbookEvent.groupId, this.dateTransform));
                }
                groupedEventsMap.get(logbookEvent.groupId).logbookEvents.push(logbookEvent);
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
     * @param eObservationItem item
     */
    openActionsMenu(event: Event, logbookEvent: LogbookEventModel) {
        event.stopPropagation();
        this.popoverCtrl.create({
            component: LogbookEventActionMenuComponent,
            componentProps: { logbookEvent: logbookEvent },
            event: event,
            cssClass: 'action-menu-popover'
        }).then(popover => {
            popover.present();
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
     * Retourne le lien pointant vers l'historique Friendly des archives JDB
     * @return le lien Friendly pointant vers l'historique Friendly
     */
    getFriendlyLink() {
        return `${this.config.friendlyUrl}/portailWeb/portail.do?action=validerRechercheInd&matricule=${this.pnc.matricule}`;
    }

    /**
     * Vérifie que l'on est en mode connecté
     * @return true si on est en mode connecté, false sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }
}
