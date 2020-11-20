import { MyBoardNotificationTypeEnum } from './../../../../core/enums/my-board/my-board-notification-type.enum';
import { from, Observable, Subject } from 'rxjs';
import {
  MyBoardNotificationSummaryModel
} from 'src/app/core/models/my-board/my-board-notification-summary.model';
import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import {
  NotificationDocumentTypeEnum
} from '../../../../core/enums/my-board/notification-document-type.enum';
import { PagePositionEnum } from '../../../../core/enums/page-position.enum';
import {
  MyBoardNotificationFilterModel
} from '../../../../core/models/my-board/my-board-notification-filter.model';
import {
  PagedMyBoardNotificationModel
} from '../../../../core/models/my-board/paged-my-board-notification.model';
import { AlertDialogService } from '../../../../core/services/alertDialog/alert-dialog.service';
import {
  MyBoardNotificationService
} from '../../../../core/services/my-board/my-board-notification.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { MyBoardFiltersComponent } from '../../components/my-board-filters/my-board-filters.component';
import * as _ from 'lodash';

@Component({
  selector: 'my-board-home',
  templateUrl: './my-board-home.page.html',
  styleUrls: ['./my-board-home.page.scss'],
})
export class MyBoardHomePage {
  pncNotifications = new Array<MyBoardNotificationModel>();
  filters = new MyBoardNotificationFilterModel();
  filtersSubject = new Subject<MyBoardNotificationFilterModel>();
  myBoardNotificationSummary = new MyBoardNotificationSummaryModel();

  totalNotifications = 0;
  isLoading = true;
  isMenuOpened = false;

  selectAllCheckboxValue = false;

  PAGE_SIZE = 15;

  MyBoardNotificationTypeEnum = MyBoardNotificationTypeEnum;
  myBoardNotificationType = MyBoardNotificationTypeEnum.ALERT;

  @ViewChild('myBoardFilters', { static: false }) myBoardFilters: MyBoardFiltersComponent;

  constructor(
    private sessionService: SessionService,
    private myBoardNotificationService: MyBoardNotificationService,
    private connectivityService: ConnectivityService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private alertDialogService: AlertDialogService,
    private events: Events,
    private router: Router
  ) {
    this.filters.size = this.PAGE_SIZE;
    this.resetPageNumber();

    this.filtersSubject
      .switchMap((filters) => this.handlePageSearch(filters))
      .subscribe(pncNotifications => {
        this.handleNotificationSearchResponse(pncNotifications);
      });
  }

  ionViewDidEnter() {
    this.filters.notifiedPncMatricule = this.sessionService.getActiveUser().matricule;
    this.getMyBoardNotificationSummary().then((myBoardNotificationSummary) => {
      this.myBoardNotificationType = myBoardNotificationSummary.lastMyBoardNotification ? myBoardNotificationSummary.lastMyBoardNotification.type : MyBoardNotificationTypeEnum.ALERT;
      // Si le nombre de notif a changé, on demande à l'utilisateur s'il souhaite relancer la recherche pour mettre à jour la vue
      if (this.totalNotifications !== 0 && myBoardNotificationSummary.totalFiltered !== this.totalNotifications) {
        this.confirmMyBoardRefresh();
      }
    });
  }

  /**
   * Récupère un "résumé" du total de notifications
   * @return une promesse contenant le "résumé"
   */
  getMyBoardNotificationSummary(): Promise<MyBoardNotificationSummaryModel> {
    const promise = this.myBoardNotificationService.getMyBoardNotificationSummary(this.filters);
    promise.then((myBoardNotificationSummary) => {
      this.myBoardNotificationSummary = myBoardNotificationSummary;
    });
    return promise;
  }

  /**
   * Demande la confirmation à l'utilisateur avant de lancer un rafraichissement de la liste
   */
  async confirmMyBoardRefresh() {
    const alert = await this.alertDialogService.openAlertDialog(
      this.translateService.instant('MY_BOARD.CONFIRM_LIST_REFRESH.TITLE'),
      this.translateService.instant('MY_BOARD.CONFIRM_LIST_REFRESH.MESSAGE'),
      this.translateService.instant('GLOBAL.BUTTONS.YES'),
      this.translateService.instant('GLOBAL.BUTTONS.NO'),
    );
    alert.onDidDismiss().then(value => {
      if (value.role === 'confirm') {
        this.launchFirstSearch();
      }
    });
  }

  /**
   * Lance une recherche suite à une mise à jour des filtres
   */
  applyFilters() {
    this.filters.pagePosition = PagePositionEnum.FIRST;
    this.filtersSubject.next(this.filters);
  }

  /**
   * Remet à zéro le numéro de page
   */
  resetPageNumber() {
    this.filters.offset = 0;
    this.filters.page = 0;
  }

  /**
   * Lance la recherche initiale
   */
  launchFirstSearch() {
    this.filters.pagePosition = PagePositionEnum.FIRST;
    this.filtersSubject.next(this.filters);
  }

  /**
   * Gère la recherche en fonction des filtres passés
   * @param filters les filtres à utiliser dans la recherche
   * @return un observable contenant les résultats de la recherche
   */
  handlePageSearch(filters: MyBoardNotificationFilterModel): Observable<PagedMyBoardNotificationModel> {
    if (filters.pagePosition === PagePositionEnum.FIRST) {
      this.resetPageNumber();
      this.isLoading = true;
      this.selectAllCheckboxValue = false;
      return this.getPncNotifications(filters);
    } else {
      if (this.totalNotifications === undefined || this.filters.page < (this.totalNotifications / this.PAGE_SIZE)) {
        this.filters.page++;
        this.filters.offset = this.filters.page * this.filters.size;
        return this.getPncNotifications(filters);
      }
    }

    return new Observable();
  }

  /**
   * Charge la page suivante
   */
  loadNextPage() {
    this.filters.pagePosition = PagePositionEnum.NEXT;
    this.filtersSubject.next(this.filters);
  }

  /**
   * Récupère les notifications correspondants au filtre.
   */
  getPncNotifications(filters: MyBoardNotificationFilterModel): Observable<PagedMyBoardNotificationModel> {
    return from(this.myBoardNotificationService.getNotifications(filters)
      .then((pagedNotification) => {
        return pagedNotification;
      }).catch(error => {
        return error;
      }));
  }

  /**
   * Traite les notifications récupérées
   * @param pagedNotification la page contenant les notifications
   */
  handleNotificationSearchResponse(pagedNotification: any) {
    if (this.filters.pagePosition === PagePositionEnum.NEXT) {
      this.pncNotifications = this.pncNotifications.concat(pagedNotification.content);
    } else {
      this.pncNotifications = pagedNotification.content;
    }

    this.selectAllCheckboxValue = false;

    this.totalNotifications = pagedNotification.page.totalElements;

    this.isLoading = false;
  }

  /**
   * Vérifie l'état de la connexion et le statut du pnc connecté.
   * @return true si l'utilisateur est connecté et cadre, false sinon.
   */
  canDisplayNotifications(): boolean {
    return this.connectivityService.isConnected();
  }

  /**
   * Ouvre la notification en la marquant lue et en redirigant l'utilisateur vers le document concerné
   * @param notification la notification à ouvrir
   */
  openNotification(notification: MyBoardNotificationModel) {
    if (!notification.checked) {
      const notificationIdsArray = new Array();
      notificationIdsArray.push(notification.techId);
      this.myBoardNotificationService.readNotifications(notificationIdsArray, true).then(() => {
        notification.checked = true;
        this.events.publish('myBoard:uncheckedNotificationCountUpdate', this.myBoardNotificationSummary.totalUncheckedNotifications + this.myBoardNotificationSummary.totalUncheckedAlerts - 1);
      });
    }

    this.router.navigate([this.getDocumentRoute(notification.documentType, notification.concernedPnc.matricule, notification.documentId)]);
  }

  /**
   * Récupère la route d'un document
   * @param documentType le type de document
   * @param matricule le matricule du PNC auquel le document appartient
   * @param documentId l'id du document
   * @return la route vers le document du PNC
   */
  getDocumentRoute(documentType: NotificationDocumentTypeEnum, matricule: string, documentId: number): string {
    const pncEDossierRoute = `/tabs/visit/${matricule}`;
    const routes = {
      [NotificationDocumentTypeEnum.CONGRATULATION_LETTER]: `${pncEDossierRoute}/congratulation-letter/detail/${documentId}`,
      [NotificationDocumentTypeEnum.EOBS]: `${pncEDossierRoute}/eobservation/detail/${documentId}`,
      [NotificationDocumentTypeEnum.CAREER_OBJECTIVE]: `${pncEDossierRoute}/career-objective/create/${documentId}`,
      [NotificationDocumentTypeEnum.WAYPOINT]: `${pncEDossierRoute}/career-objective/waypoint/0/${documentId}`,
      [NotificationDocumentTypeEnum.PROFESSIONAL_INTERVIEW]: `${pncEDossierRoute}/professional-interview/detail/${documentId}`,
      [NotificationDocumentTypeEnum.LOGBOOK]: `${pncEDossierRoute}/logbook/detail/${documentId}/false`,
      [NotificationDocumentTypeEnum.LOGBOOK_CCO]: `${pncEDossierRoute}/logbook/detail/${documentId}/false`,
      [NotificationDocumentTypeEnum.LOGBOOK_ISCV]: `${pncEDossierRoute}/logbook/detail/${documentId}/false`,
      [NotificationDocumentTypeEnum.HR_DOCUMENT]: `${pncEDossierRoute}/hr-document/detail/${documentId}`,
      [NotificationDocumentTypeEnum.PROFESSIONAL_LEVEL]: `${pncEDossierRoute}/professional-level`
    };
    return routes[documentType];
  }

  /**
   * Ouvre/ferme le menu latéral contenant les filtres
   */
  toggleFiltersMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }

  /**
   * Archive/désarchive les notifications sélectionnées
   * @param archive si on souhaite archiver/désarchiver les notifications
   */
  archiveSelectedNotifications(archive: boolean = true) {
    const selectedNotificationIds = this.getSelectedNotificationIds();
    if (selectedNotificationIds.length === 0) {
      this.toastService.warning(this.translateService.instant('MY_BOARD.MESSAGES.WARNING.NO_SELECTED_ITEM'));
    } else {
      this.myBoardNotificationService.archiveNotifications(selectedNotificationIds, archive).then(() => {
        if (archive) {
          selectedNotificationIds.length > 1 ?
            this.toastService.success(this.translateService.instant('MY_BOARD.MESSAGES.SUCCESS.NOTIFICATIONS_ARCHIVED')) :
            this.toastService.success(this.translateService.instant('MY_BOARD.MESSAGES.SUCCESS.NOTIFICATION_ARCHIVED'));
        } else {
          selectedNotificationIds.length > 1 ?
            this.toastService.success(this.translateService.instant('MY_BOARD.MESSAGES.SUCCESS.NOTIFICATIONS_DEARCHIVED')) :
            this.toastService.success(this.translateService.instant('MY_BOARD.MESSAGES.SUCCESS.NOTIFICATION_DEARCHIVED'));
        }
        this.getMyBoardNotificationSummary();
        this.launchFirstSearch();
      });
    }
  }

  /**
   * Ouvre une popup de confirmation pour la demande de suppression
   */
  async confirmNotificationsDeletion() {
    if (this.getSelectedNotificationIds().length === 0) {
      this.toastService.warning(this.translateService.instant('MY_BOARD.MESSAGES.WARNING.NO_SELECTED_ITEM'));
    } else {
      const alert = await this.alertDialogService.openAlertDialog(
        this.translateService.instant('MY_BOARD.CONFIRM_DELETION_ALERT.TITLE'),
        this.translateService.instant('MY_BOARD.CONFIRM_DELETION_ALERT.MESSAGE'),
        this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
        this.translateService.instant('GLOBAL.BUTTONS.CANCEL')
      );
      alert.onDidDismiss().then(value => {
        if (value.role === 'confirm') {
          this.deleteSelectedNotifications();
        }
      });
    }
  }

  /**
   * Supprime les notifications sélectionnées
   */
  deleteSelectedNotifications() {
    const selectedNotificationIds = this.getSelectedNotificationIds();
    this.myBoardNotificationService.deleteNotifications(selectedNotificationIds).then(() => {
      selectedNotificationIds.length > 1 ?
        this.toastService.success(this.translateService.instant('MY_BOARD.MESSAGES.SUCCESS.NOTIFICATIONS_DELETED')) :
        this.toastService.success(this.translateService.instant('MY_BOARD.MESSAGES.SUCCESS.NOTIFICATION_DELETED'));
      this.getMyBoardNotificationSummary();
      this.launchFirstSearch();
    });
  }

  /**
   * Récupère la liste des ids des notifications sélectionnées
   * @return la liste des ids des notifications sélectionnées
   */
  getSelectedNotificationIds(): Array<number> {
    return this.pncNotifications
      .filter(pncNotification => pncNotification.selected)
      .map(pncNotification => pncNotification.techId);
  }

  /**
   * Sélectionne/déselectionne toutes les notifications
   */
  toggleSelectAll() {
    this.selectAllCheckboxValue = !this.selectAllCheckboxValue;
    this.pncNotifications.forEach(pncNotification => {
      pncNotification.selected = this.selectAllCheckboxValue;
    });
  }

  /**
   * Récupère le nombre de notifications sélectionnées
   * @return le nombre de notifications sélectionnées
   */
  getSelectedNotificationTotal(): number {
    return this.pncNotifications.filter(pncNotification => pncNotification.selected).length;
  }

  /**
   * Vérifie si des notifications sont présentes
   * @return vrai si c'est le cas, faux sinon
   */
  hasNotifications() {
    return this.pncNotifications && this.pncNotifications.length > 0;
  }

  /**
   * Teste si la vue des archives est active ou non
   * @return vrai si la vue des archives est active, faux sinon
   */
  isArchiveViewEnabled(): boolean {
    return this.filters.archived;
  }

  /**
   * Affiche les notifications
   */
  displayNotifications(): void {
    this.sessionService.appContext.alertFilters = _.cloneDeep(this.filters);
    this.myBoardFilters.updatefilterForm(MyBoardNotificationTypeEnum.NOTIFICATION);
    //this.filters = this.sessionService.appContext.notificationFilters ? this.sessionService.appContext.notificationFilters : this.filters;
    this.myBoardNotificationType = MyBoardNotificationTypeEnum.NOTIFICATION;
    this.filters.type = MyBoardNotificationTypeEnum.NOTIFICATION;
    this.launchFirstSearch();
  }

  /**
   * Affiche les rappels
   */
  displayReminders(): void {
    this.sessionService.appContext.notificationFilters = _.cloneDeep(this.filters);
    this.myBoardFilters.updatefilterForm(MyBoardNotificationTypeEnum.ALERT);
    //this.filters = this.sessionService.appContext.alertFilters ? this.sessionService.appContext.alertFilters : this.filters;
    this.myBoardNotificationType = MyBoardNotificationTypeEnum.ALERT;
    this.filters.type = MyBoardNotificationTypeEnum.ALERT;
    this.launchFirstSearch();
  }

  /**
   * Vérifie si un onglet est actif
   * @param mode le mode (onglet) à tester
   * @return vrai si le mode est actif, faux sinon
   */
  isTabActive(type: MyBoardNotificationTypeEnum): boolean {
    return type === this.myBoardNotificationType;
  }
}


