import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';

import { Component, OnInit } from '@angular/core';

import { AppConstant } from '../../../../app.constant';
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

  constructor(
    private sessionService: SessionService,
    private myBoardNotificationService: MyBoardNotificationService,
    private connectivityService: ConnectivityService
  ) { }

  ngOnInit() {
    this.filter.notifiedPncMatricule = this.sessionService.getActiveUser().matricule;
    this.filter.offset = 0;
    this.filter.page = 0;
    this.filter.size = AppConstant.pageSize;
  }

  ionViewDidEnter() {
    this.pncNotifications = new Array<MyBoardNotificationModel>();
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
    this.myBoardNotificationService.readNotification(notification.techId);
  }
}
