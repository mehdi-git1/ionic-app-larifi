

import { Injectable } from '@angular/core';

import {
    MyBoardNotificationFilterModel
} from '../../models/my-board/my-board-notification-filter.model';
import {
    PagedMyBoardNotificationModel
} from '../../models/my-board/paged-my-board-notification.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { MyBoardNotificationOfflineService } from './my-board-notification-offline.service';
import { MyBoardNotificationOnlineService } from './my-board-notification-online.service';

@Injectable({
  providedIn: 'root'
})
export class MyBoardNotificationService extends BaseService {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineService: MyBoardNotificationOnlineService,
    private offlineService: MyBoardNotificationOfflineService,
  ) {
    super(connectivityService, onlineService, offlineService);
  }

  /**
   * Récupère les notifications adressées au pnc
   *
   * @param filter les filtres à appliquer à la requete
   * @return une promesse avec la liste des notifications
   */
  getNotifications(filter: MyBoardNotificationFilterModel): Promise<PagedMyBoardNotificationModel> {
    return this.execFunctionService('getNotifications', filter);
  }

  /**
   * Marque une notification comme lue
   *
   * @param notificationId l'id de la notification à marquer comme lue
   */
  readNotification(notificationId: number) {
    return this.execFunctionService('readNotification', notificationId);
  }
}
