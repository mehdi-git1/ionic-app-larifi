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

  PAGE_SIZE = 15;

  constructor(
    private sessionService: SessionService,
    private myBoardNotificationService: MyBoardNotificationService,
    private connectivityService: ConnectivityService,
    private router: Router
  ) { }

  ngOnInit() {
    this.filter.notifiedPncMatricule = this.sessionService.getActiveUser().matricule;
    this.filter.size = this.PAGE_SIZE;
  }

  ionViewDidEnter() {
    this.pncNotifications = new Array<MyBoardNotificationModel>();
    this.filter.offset = 0;
    this.filter.page = 0;
    this.isLoading = true;
    this.getPncNotifications(this.filter);
  }

  /**
   * Charge les données supplémentaires
   * @param event evenement déclenché
   */
  loadMoreData(event) {
    if (this.pncNotifications.length < this.totalNotifications) {
      this.filter.page += 1;
      this.filter.offset = this.filter.page * this.filter.size;
      this.getPncNotifications(this.filter).then(() => {
        event.target.complete();
      });
    } else {
      event.target.complete();
    }
  }

  /**
   * Récupère les notifications correspondants au filtre.
   * @param filter le filtre à appliquer à la requête
   */
  getPncNotifications(filter: MyBoardNotificationFilterModel): Promise<PagedMyBoardNotificationModel> {
    const promise = this.myBoardNotificationService
      .getNotifications(filter);
    promise.then((pagedNotification) => {
      this.pncNotifications = this.pncNotifications.concat(pagedNotification.content);
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
