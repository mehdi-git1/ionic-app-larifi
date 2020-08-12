import { from, Observable, Subject } from 'rxjs';
import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
    NotificationDocumentTypeEnum
} from '../../../../core/enums/my-board/notification-document-type.enum';
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

enum PagePosition {
  FIRST, PREVIOUS, NEXT
}
@Component({
  selector: 'my-board-home',
  templateUrl: './my-board-home.page.html',
  styleUrls: ['./my-board-home.page.scss'],
})
export class MyBoardHomePage {
  pncNotifications = new Array<MyBoardNotificationModel>();
  filters = new MyBoardNotificationFilterModel();
  previousPageSubject = new Subject<MyBoardNotificationFilterModel>();
  nextPageSubject = new Subject<MyBoardNotificationFilterModel>();
  firstPageSubject = new Subject<MyBoardNotificationFilterModel>();

  totalNotifications: number;
  isLoading = false;
  isMenuOpened = false;

  selectAllCheckboxValue = false;

  PAGE_SIZE = 15;

  previousPageNumber: number;
  nextPageNumber: number;

  constructor(
    private sessionService: SessionService,
    private myBoardNotificationService: MyBoardNotificationService,
    private connectivityService: ConnectivityService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private alertDialogService: AlertDialogService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filters.size = this.PAGE_SIZE;
    this.resetPageNumber();

    this.previousPageSubject
      .switchMap((filters) => this.handlePreviousPageSearch(filters))
      .subscribe(pncNotifications => {
        this.handleNotificationSearchResponse(pncNotifications, PagePosition.PREVIOUS);
      });

    this.nextPageSubject
      .switchMap((filters) => this.handleNextPageSearch(filters))
      .subscribe(pncNotifications => {
        this.handleNotificationSearchResponse(pncNotifications, PagePosition.NEXT);
      });

    this.firstPageSubject
      .switchMap((filters) => this.handleFirstPageSearch(filters))
      .subscribe(pncNotifications => {
        this.handleNotificationSearchResponse(pncNotifications, PagePosition.FIRST);
      });
  }

  ionViewDidEnter() {
    this.filters.notifiedPncMatricule = this.sessionService.getActiveUser().matricule;
    this.launchFirstSearch();
  }

  /**
   * Lance une recherche suite à une mise à jour des filtres
   */
  applyFilters() {
    this.resetPageNumber();
    this.initPageNumbers();
    this.firstPageSubject.next(this.filters);
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
    this.initPageNumbers();
    this.firstPageSubject.next(this.filters);
  }

  /**
   * Initialise les numéros de page afin de gérer la pagination bi-directionnelle
   */
  initPageNumbers() {
    this.previousPageNumber = this.filters.page - 1;
    this.nextPageNumber = this.filters.page + 1;
  }

  /**
   * Gère la récupération de la page initiale
   */
  handleFirstPageSearch(filters: MyBoardNotificationFilterModel): Observable<PagedMyBoardNotificationModel> {
    this.isLoading = true;
    this.selectAllCheckboxValue = false;
    return this.getPncNotifications(filters);
  }

  /**
   * Charge la page précédente
   * @param event l'événement émis
   */
  loadPreviousPage(event) {
    this.previousPageSubject.next(this.filters);
  }

  /**
   * Gère la récupération de la page suivante
   */
  handlePreviousPageSearch(filters: MyBoardNotificationFilterModel): Observable<PagedMyBoardNotificationModel> {
    console.log('load previous');
    if (this.previousPageNumber >= 0) {
      this.filters.page = this.previousPageNumber--;
      this.filters.offset = this.filters.page * this.filters.size;
      return this.getPncNotifications(filters);
    } else {
      return new Observable();
    }
  }

  /**
   * Charge la page suivante
   * @param event l'événement émis
   */
  loadNextPage(event) {
    this.nextPageSubject.next(this.filters);
  }

  /**
   * Gère la récupération de la page suivante
   */
  handleNextPageSearch(filters: MyBoardNotificationFilterModel): Observable<PagedMyBoardNotificationModel> {
    if (this.totalNotifications === undefined || this.nextPageNumber < (this.totalNotifications / this.PAGE_SIZE)) {
      this.filters.page = this.nextPageNumber++;
      this.filters.offset = this.filters.page * this.filters.size;
      return this.getPncNotifications(filters);
    } else {
      return new Observable();
    }
  }

  /**
   * Récupère les notifications correspondants au filtre.
   */
  getPncNotifications(filters: MyBoardNotificationFilterModel): Observable<PagedMyBoardNotificationModel> {
    return from(this.myBoardNotificationService.getNotifications(filters)
      .then((pagedNotification) => {
        return pagedNotification;
      }));
  }

  /**
   * Traite les notifications récupérées
   * @param pagedNotification la page contenant les notifications
   * @param pagePosition la position de la page
   */
  handleNotificationSearchResponse(pagedNotification: any, pagePosition: PagePosition) {
    // Ajoute le numéro de page sur chaque notification afin de pouvoir retomber sur cette page à l'ouverte d'une notif
    pagedNotification.content.forEach(notification => {
      notification.pageNumber = this.filters.page;
    });
    if (pagePosition === PagePosition.NEXT) {
      this.pncNotifications = this.pncNotifications.concat(pagedNotification.content);
    } else if (pagePosition === PagePosition.PREVIOUS) {
      this.pncNotifications.unshift(...pagedNotification.content);
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
    this.filters.page = notification.pageNumber;

    if (!notification.checked) {
      this.myBoardNotificationService.readNotification(notification.techId, true);
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
   * Archive les notificaitons sélectionnées
   */
  archiveSelectedNotifications() {
    const selectedNotificationIds = this.getSelectedNotificationIds();
    if (selectedNotificationIds.length === 0) {
      this.toastService.warning(this.translateService.instant('MY_BOARD.MESSAGES.WARNING.NO_SELECTED_ITEM'));
    } else {
      this.myBoardNotificationService.archiveNotifications(selectedNotificationIds, true).then(() => {
        this.toastService.success(this.translateService.instant('MY_BOARD.MESSAGES.SUCCESS.NOTIFICATIONS_ARCHIVED'));
        this.launchFirstSearch();
      });
    }
  }

  /**
   * Ouvre une popup de confirmation pour la demande de suppression
   */
  confirmNotificationsDeletion() {
    if (this.getSelectedNotificationIds().length === 0) {
      this.toastService.warning(this.translateService.instant('MY_BOARD.MESSAGES.WARNING.NO_SELECTED_ITEM'));
    } else {
      const dialogForm = this.formBuilder.group({
        dialogTitle: [this.translateService.instant('MY_BOARD.CONFIRM_DELETION_ALERT.TITLE')],
        dialogMsg: [this.translateService.instant('MY_BOARD.CONFIRM_DELETION_ALERT.MESSAGE')],
        dialogType: ['confirm'],
        okBtnTitle: [this.translateService.instant('GLOBAL.BUTTONS.CONFIRM')],
        cancelBtnTitle: [this.translateService.instant('GLOBAL.BUTTONS.CANCEL')]
      });
      const dialogRef = this.alertDialogService.openAlertDialog(dialogForm.value);
      dialogRef.afterClosed().toPromise().then((result) => {
        if (result === 'ok' || result === 'true') {
          this.deleteSelectedNotifications();
        }
      });
    }
  }

  /**
   * Supprime les notifications sélectionnées
   */
  deleteSelectedNotifications() {
    this.myBoardNotificationService.deleteNotifications(this.getSelectedNotificationIds()).then(() => {
      this.toastService.success(this.translateService.instant('MY_BOARD.MESSAGES.SUCCESS.NOTIFICATIONS_DELETED'));
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

}


