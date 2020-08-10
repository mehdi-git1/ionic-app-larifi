import { Injectable } from '@angular/core';

import {
    MyBoardNotificationFilterModel
} from '../../models/my-board/my-board-notification-filter.model';
import {
    PagedMyBoardNotificationModel
} from '../../models/my-board/paged-my-board-notification.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OfflineMyBoardNotificationService } from './offline-my-board-notification.service';
import { OnlineMyBoardNotificationService } from './online-my-board-notification.service';

@Injectable({
  providedIn: 'root'
})
export class MyBoardNotificationService extends BaseService {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineService: OnlineMyBoardNotificationService,
    private offlineService: OfflineMyBoardNotificationService,
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
   * Marque une notification comme lue/non lue
   *
   * @param notificationId l'id de la notification à marquer comme lue
   * @param isRead si la notification doit être marquée lue/non lue
   */
  readNotification(notificationId: number, isRead: boolean) {
    return this.execFunctionService('readNotification', notificationId, isRead);
  }
}
