import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
    NotificationDocumentTypeEnum
} from '../../../../core/enums/my-board/notification-document-type.enum';
import {
    MyBoardNotificationFilterModel
} from '../../../../core/models/my-board/my-board-notification-filter.model';
import {
    PagedMyBoardNotificationModel
} from '../../../../core/models/my-board/paged-my-board-notification.model';
import {
    MyBoardNotificationService
} from '../../../../core/services/my-board/my-board-notification.service';
import { SessionService } from '../../../../core/services/session/session.service';

enum PagePosition {
  PREVIOUS, NEXT
}
@Component({
  selector: 'my-board-home',
  templateUrl: './my-board-home.page.html',
  styleUrls: ['./my-board-home.page.scss'],
})
export class MyBoardHomePage implements OnInit {
  pncNotifications: Array<MyBoardNotificationModel>;
  filter = new MyBoardNotificationFilterModel();
  totalNotifications: number;
  isLoading = false;

  PAGE_SIZE = 10;

  previousPageNumber: number;
  nextPageNumber: number;

  constructor(
    private sessionService: SessionService,
    private myBoardNotificationService: MyBoardNotificationService,
    private connectivityService: ConnectivityService,
    private router: Router
  ) { }

  ngOnInit() {
    this.filter.size = this.PAGE_SIZE;
    this.filter.offset = 0;
    this.filter.page = 0;
  }

  ionViewDidEnter() {
    this.pncNotifications = new Array<MyBoardNotificationModel>();
    this.filter.notifiedPncMatricule = this.sessionService.getActiveUser().matricule;
    this.isLoading = true;
    this.initPageNumbers();
    this.getPncNotifications(this.filter, PagePosition.NEXT);
  }

  /**
   * Initialise les numéros de page afin de gérer la pagination bi-directionnelle
   */
  initPageNumbers() {
    this.previousPageNumber = this.filter.page - 1;
    this.nextPageNumber = this.filter.page + 1;
  }

  /**
   * Charge la page précédente
   * @param event événement déclenché
   */
  loadPreviousPage(event) {
    if (this.previousPageNumber >= 0) {
      this.filter.page = this.previousPageNumber--;
      this.filter.offset = this.filter.page * this.filter.size;
      this.getPncNotifications(this.filter, PagePosition.PREVIOUS).then(() => {
        event.target.complete();
      });
    } else {
      event.target.disabled = true;
    }
  }

  /**
   * Charge la page suivante
   * @param event événement déclenché
   */
  loadNextPage(event) {
    if (this.nextPageNumber < (this.totalNotifications / this.PAGE_SIZE)) {
      this.filter.page = this.nextPageNumber++;
      this.filter.offset = this.filter.page * this.filter.size;
      this.getPncNotifications(this.filter, PagePosition.NEXT).then(() => {
        event.target.complete();
      });
    } else {
      event.target.disabled = true;
    }
  }

  /**
   * Récupère les notifications correspondants au filtre.
   * @param filter le filtre à appliquer à la requête
   * @param pagePosition la position de la page
   */
  getPncNotifications(filter: MyBoardNotificationFilterModel, pagePosition: PagePosition): Promise<PagedMyBoardNotificationModel> {
    const promise = this.myBoardNotificationService.getNotifications(filter);
    promise.then((pagedNotification) => {
      // Ajoute le numéro de page sur chaque notification afin de pouvoir retomber sur cette page à l'ouverte d'une notif
      pagedNotification.content.forEach(notification => {
        notification.pageNumber = filter.page;
      });
      if (pagePosition === PagePosition.NEXT) {
        this.pncNotifications = this.pncNotifications.concat(pagedNotification.content);
      } else {
        this.pncNotifications.unshift(...pagedNotification.content);
      }
      this.filter.page = pagedNotification.page.number;
      this.totalNotifications = pagedNotification.page.totalElements;
    }).finally(() => {
      this.isLoading = false;
    });
    return promise;
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
    this.filter.page = notification.pageNumber;

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
}


