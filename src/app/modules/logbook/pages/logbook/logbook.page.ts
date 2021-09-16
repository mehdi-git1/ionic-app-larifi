import * as moment from 'moment';
import { LogbookEventStatusEnum } from 'src/app/core/enums/logbook-event/logbook-event-status-enum';
import { SortDirection } from 'src/app/core/enums/sort-direction-enum';
import { LogbookEventFilterModel } from 'src/app/core/models/logbook/logbook-event-filter.model';
import { PagedGenericModel } from 'src/app/core/models/paged-generic-model';
import { ToastService } from 'src/app/core/services/toast/toast.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController, IonInfiniteScroll, LoadingController, PopoverController
} from '@ionic/angular';
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
import {
  LogbookEventActionMenuComponent
} from '../../components/logbook-event-action-menu/logbook-event-action-menu.component';

@Component({
  selector: 'log-book',
  templateUrl: 'logbook.page.html',
  styleUrls: ['./logbook.page.scss']
})
export class LogbookPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  displayedLogbookEventsColumns: string[] =
    ['childEvents', 'eventDate', 'creationDate', 'category', 'important', 'attach', 'event', 'origin', 'author', 'actions'];
  pnc: PncModel;

  eventFilters: LogbookEventFilterModel;
  pncLogbookEventsGroup: Array<LogbookEventGroupModel>;
  TabHeaderEnum = TabHeaderEnum;
  eventDateColumn = 'eventDate';
  sortDirection: SortDirection;
  dataLoading = false;
  loadingIsOver = false;
  LogbookEventTypeEnum = LogbookEventTypeEnum;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService,
    private sessionService: SessionService,
    private onlineLogbookEventService: OnlineLogbookEventService,
    private popoverCtrl: PopoverController,
    private connectivityService: ConnectivityService,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private toastService: ToastService,
    private loadingCtrl: LoadingController
  ) {
  }

  ngOnInit(): void {
    this.eventFilters = new LogbookEventFilterModel();

    if (this.sessionService.visitedPnc) {
      this.pnc = this.sessionService.visitedPnc;
    } else {
      this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
    }
  }

  ionViewWillEnter() {
    this.refreshPage();
  }

  /**
   * Vérifie que le tri est dans l'ordre déscendant
   * @param sortDirection le sens du tri
   * @returns true si descendant, false sinon.
   */
  isDesc(sortDirection: SortDirection): boolean {
    return sortDirection === SortDirection.DESC;
  }

  /**
   * Effectue le tri sur la date de création selon l'ordre donné.
   * @param event l'évènement déclencheur
   * @param sortDirection l'ordre de tri souhaité
   */
  sortByDirection(sortDirection: string, event: Event) {
    event.stopPropagation();
    this.infiniteScroll.disabled = false;
    const currentArchivedFilterValue = this.eventFilters.archived;
    this.initFilter();
    this.eventFilters.archived = currentArchivedFilterValue;
    this.eventFilters.sortDirection = sortDirection as SortDirection;
    this.getLogbookEventsByFilters(this.pnc.matricule, this.eventFilters).then(pagedLogbookEvents => {
      this.pncLogbookEventsGroup = [];
      this.handleResponse(pagedLogbookEvents);
      this.eventFilters.sortDirection = SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC;
    });
  }

  /**
   * Récupère les évènements journal de bord récents du pnc.
   */
  getRecentsLogbookEvent() {
    this.initFilter();
    this.infiniteScroll.disabled = false;
    this.dataLoading = true;
    this.loadingIsOver = false;
    this.getLogbookEventsByFilters(this.pnc.matricule, this.eventFilters).then(pagedLogbookEvents => {
      this.pncLogbookEventsGroup = [];
      this.handleResponse(pagedLogbookEvents);
    });
  }
  /**
   * Récupère les évènements du pnc en fonction des filtres.
   * @param matricule le matricule du pnc dont on souhaite obtenir les évènements
   * @param filter les filtres à appliquer
   * @returns une promesse contenant les évènements à afficher
   */
  getLogbookEventsByFilters(matricule: string, filter: LogbookEventFilterModel): Promise<PagedGenericModel<LogbookEventModel>> {
    this.eventFilters.isLastEvent = true;
    return this.onlineLogbookEventService.getLogbookEventsByFilters(matricule, this.eventFilters);
  }

  /**
   * Traite les évènements reçus en les ajoutant aux évènements déjà affichés
   * et gère la pagination.
   *
   * @param pagedLogbookEventModel les évènements reçus
   */
  handleResponse(pagedLogbookEventModel: PagedGenericModel<LogbookEventModel>) {
    this.pncLogbookEventsGroup = this.pncLogbookEventsGroup.concat(this.buildGroup(pagedLogbookEventModel.content));
    this.eventFilters.page = this.eventFilters.page + 1;
    this.infiniteScroll.disabled = (this.pncLogbookEventsGroup.length === pagedLogbookEventModel.page.totalElements);
    this.dataLoading = false;
    this.loadingIsOver = true;
    this.infiniteScroll.complete();
  }

  /**
   * Contruit des groupes d'évènements à partir d'une liste d'évènements
   * @param logbookEvents les évènements JDB du pnc
   * @returns les évènements groupés par identifiant du group
   */
  buildGroup(logbookEvents: LogbookEventModel[]): Array<LogbookEventGroupModel> {
    return logbookEvents.map(logbookEvent => new LogbookEventGroupModel(logbookEvent.groupId, [logbookEvent]));
  }

  /**
   * Rafraîchit la page
   */
  refreshPage() {
    this.pncLogbookEventsGroup = new Array();
    this.initFilter();
    this.loadingIsOver = false;
    this.getLogbookEventsByFilters(this.pnc.matricule, this.eventFilters).then(pagedLogbookEvents => {
      this.loadingIsOver = true;
      this.pncLogbookEventsGroup = [];
      this.handleResponse(pagedLogbookEvents)
    });
  }

  /**
   * initialise la valeur des filtres
   */
  initFilter() {
    this.eventFilters.page = 0;
    this.eventFilters.offset = 0;
    this.eventFilters.size = AppConstant.PAGE_SIZE;
    this.eventFilters.isLastEvent = true;
    this.eventFilters.archived = false;
    this.eventFilters.status = LogbookEventStatusEnum.REGISTERED;
    this.eventFilters.sortColumn = this.eventDateColumn;
    this.eventFilters.sortDirection = SortDirection.DESC;
  }

  /**
   * Récupère les évènements liés du groupe. Si les évènements liés ne sont pas déjà chargés,
   * une requête est lancée pour les récupérer.
   * @param groupId l'identifiant du groupe dont on souhaite récupérer les évènements liés
   *
   */
  async getRelatedEvents(groupId: number) {
    if (!this.isRelatedEventsLoaded(groupId)) {
      const filter = new LogbookEventFilterModel();
      filter.groupId = groupId;
      filter.isLastEvent = false;
      await this.onlineLogbookEventService.getLogbookEventsByFilters(this.pnc.matricule, filter).then(pagedLogbookEvents => {
        this.pncLogbookEventsGroup.forEach(logbookEventGroup => {
          if (logbookEventGroup.groupId === groupId) {
            logbookEventGroup.logbookEvents = logbookEventGroup.logbookEvents.concat(pagedLogbookEvents.content);
          }
        });
      });
    }
  }


  /**
   * Récupère des évènements supplémentaires lorsque le bas de page est atteint
   *
   * @param event évènement déclenché lorsque le bas de page est atteint
   */
  loadMoreEvents(event) {
    this.dataLoading = true;
    this.infiniteScroll.disabled = false;
    this.getLogbookEventsByFilters(this.pnc.matricule, this.eventFilters).then(pagedLogbookEvents => {
      this.handleResponse(pagedLogbookEvents);
    });
  }


  /**
   * Vérifie que les évènements liés du groupe sont chargés.
   * @param groupdId l'identifiant du groupe dont on souhaite vérifier
   * @returns true si les évènements liés sont chargés, false sinon.
   */
  isRelatedEventsLoaded(groupdId: number): boolean {
    return this.pncLogbookEventsGroup.find(logbookEventGroup => logbookEventGroup.groupId == groupdId).logbookEvents.length > 1;
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
   * Définit l'affichage des évènements liés du groupe
   * @param groupId l'identifiant du groupe dont on veut afficher les éléments
   * @param expand état d'affichage
   * @param event évènement déclenché
   */
  setGroupExpansionState(groupId: number, expand: boolean, event: Event) {
    event.stopPropagation();
    if (expand) {
      this.getRelatedEvents(groupId);
    }
    this.pncLogbookEventsGroup.forEach(logbookEventGroup => {
      if (logbookEventGroup.groupId === groupId) {
        logbookEventGroup.expanded = expand;
      }
    });
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
          this.initFilter();
          this.getLogbookEventsByFilters(this.pnc.matricule, this.eventFilters).
            then(pagedLogbookEvent => this.handleResponse(pagedLogbookEvent));
          loading.dismiss();
        },
          error => {
            loading.dismiss();
          });
    });
  }

  /**
   * Récupère les évènements archivés du pnc.
   */
  loadArchives() {
    this.initFilter();
    this.eventFilters.archived = true;
    this.dataLoading = true;
    this.loadingIsOver = false;
    this.infiniteScroll.disabled = false;
    this.getLogbookEventsByFilters(this.pnc.matricule, this.eventFilters).then(pagedLogbookEvents => {
      this.pncLogbookEventsGroup = new Array();
      this.handleResponse(pagedLogbookEvents);
      this.dataLoading = false;
      this.loadingIsOver = true;
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
   * Vérifie que l'on est en mode connecté
   * @return true si on est en mode connecté, false sinon
   */
  isConnected(): boolean {
    return this.connectivityService.isConnected();
  }

  /**
   * Vérifie si le PNC connecté est le rédacteur de l'évènement, ou bien l'instructeur du pnc observé, ou bien son RDS
   * @return vrai si le PNC est redacteur, instructeur ou rds du pnc observé, faux sinon
   */

  canEditEvent(logbookEvent: LogbookEventModel, logbookEventIndex: number): boolean {
    const redactor = logbookEvent.redactor
      && this.sessionService.getActiveUser().matricule === logbookEvent.redactor.matricule;
    const instructor = this.pnc && this.pnc.pncInstructor
      && this.sessionService.getActiveUser().matricule === this.pnc.pncInstructor.matricule;
    const rds = this.pnc && this.pnc.pncRds && this.sessionService.getActiveUser().matricule === this.pnc.pncRds.matricule;
    const ccoIscvAdmin = this.pnc && this.securityService.isAdminCcoIscv(this.sessionService.getActiveUser());
    return redactor || instructor || rds || (ccoIscvAdmin
      && (logbookEvent.type === LogbookEventTypeEnum.CCO || logbookEvent.type === LogbookEventTypeEnum.ISCV))
      || logbookEventIndex === 0;
  }
}
