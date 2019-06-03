import { LogbookEventDetailsPage } from './../logbook-event-details/logbook-event-details.page';
import { LogbookEventGroupModel } from './../../../../core/models/logbook/logbook-event-group.model';
import { LogbookEventActionMenuComponent } from './../../components/logbook-event-action-menu/logbook-event-action-menu.component';
import { LogbookEventModel } from './../../../../core/models/logbook/logbook-event.model';
import { OnlineLogbookEventService } from './../../../../core/services/logbook/online-logbook-event.service';
import { SessionService } from './../../../../core/services/session/session.service';
import { SecurityService } from './../../../../core/services/security/security.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { LogbookEditPage } from '../logbook-edit/logbook-edit.page';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
    selector: 'log-book',
    templateUrl: 'logbook.page.html',
})
export class LogbookPage implements OnInit {

    displayedLogbookEventsColumns: string[] = ['childEvents', 'childDots', 'eventDate', 'creationDate', 'category', 'important', 'attach', 'event', 'origin', 'author', 'actions'];
    pnc: PncModel;

    logbookEvents: LogbookEventModel[];
    groupedEventsMap = new Array<LogbookEventGroupModel>();
    dataSourceLogbookEvent: MatTableDataSource<LogbookEventGroupModel>;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private pncService: PncService,
        private securityService: SecurityService,
        private sessionService: SessionService,
        private onlineLogbookEventService: OnlineLogbookEventService,
        public popoverCtrl: PopoverController) {
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
            }, error => { });

            this.onlineLogbookEventService.getLogbookEvents(matricule).then(logbookEvents => {
                const groupedEventsMap = new Map<number, LogbookEventGroupModel>();
                logbookEvents.forEach(logbookEvent => {
                    if (!groupedEventsMap.has(logbookEvent.groupId)) {
                        groupedEventsMap.set(logbookEvent.groupId, new LogbookEventGroupModel(logbookEvent.groupId));
                    }
                    groupedEventsMap.get(logbookEvent.groupId).logbookEvents.push(logbookEvent);
                });
                this.groupedEventsMap = Array.from(groupedEventsMap.values());
                this.logbookEvents = logbookEvents;
                this.dataSourceLogbookEvent = new MatTableDataSource(this.groupedEventsMap);
                this.dataSourceLogbookEvent.sort = this.sort;
            }, error => { });
        }
    }

    ionViewDidLoad() {

    }

    /**
     * Vérifie si il y a des évènements de journal de bord
     * @return true si il n'y a pas d'évènements, sinon false
     */
    hasLogbookEvents(): boolean {
        return !(this.groupedEventsMap === undefined || this.groupedEventsMap === null || this.groupedEventsMap.length === 0);
    }

    /**
     * Vérifie le groupe est composé de plusieurs évènements
     * @return true si il y a plusieurs d'évènements, sinon false
     */
    groupHasManyEvents(eventGroup: LogbookEventGroupModel): boolean {
        return !(eventGroup === undefined || eventGroup === null || eventGroup.logbookEvents.length <= 1);
    }

    collapseEventGroup(eventGroup: LogbookEventGroupModel) {
        eventGroup.expanded = !eventGroup.expanded;
    }

    /**
     * Dirige vers la page d'édition d'un évènement du journal de bord
     */
    goToLogbookCreation() {
        if (this.pnc) {
            this.navCtrl.push(LogbookEditPage, { matricule: this.pnc.matricule });
        }
    }

    /**
     * Dirige vers la page de détail d'un évènement du journal de bord
     */
    goToLogbookEventDetails() {
        if (this.pnc) {
            this.navCtrl.push(LogbookEventDetailsPage);
        }
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.groupedEventsMap !== undefined;
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
     * @param myEvent  event
     * @param eObservationItem item
     */
    openActionsMenu(myEvent: Event, logbookEvent: LogbookEventModel) {
        const popover = this.popoverCtrl.create(LogbookEventActionMenuComponent, { logbookEvent: logbookEvent }, { cssClass: 'action-menu-popover' });
        popover.present({
            ev: myEvent
        });
    }

    /**
     * Vérifie si il y a des évènements liés
     * TODO : A implémenter une fois que la fonctionnalité des évènements liés est implémentée
     * @return true si il y a des évènements liés, false sinon
     */
    logbookEventHasChdilds(): boolean {
        return false;
    }

}
