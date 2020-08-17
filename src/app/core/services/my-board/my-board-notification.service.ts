import { Injectable } from '@angular/core';

import {
    MyBoardNotificationFilterModel
} from '../../models/my-board/my-board-notification-filter.model';
import {
    MyBoardNotificationSummaryModel
} from '../../models/my-board/my-board-notification-summary.model';
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
   * Marque des notifications comme lues/non lues
   *
   * @param notificationIds les ids des notifications à marquer comme lues/non lues
   * @param isRead si les notifications doivent être marquées lues/non lues
   */
  readNotifications(notificationIds: Array<number>, isRead: boolean) {
    return this.execFunctionService('readNotifications', notificationIds, isRead);
  }

  /**
   * Archive/désarchive une liste de notifications
   * @param notificationIds les ids des notifications à traiter
   * @param isArchived si les notifications doivent être archivées/désarchivées
   */
  archiveNotifications(notificationIds: Array<number>, isArchived: boolean) {
    if (notificationIds.length > 0) {
      return this.execFunctionService('archiveNotifications', notificationIds, isArchived);
    }
  }

  /**
   * Supprime une liste de notifications
   * @param notificationIds les ids des notifications à supprimer
   */
  deleteNotifications(notificationIds: Array<number>) {
    if (notificationIds.length > 0) {
      return this.execFunctionService('deleteNotifications', notificationIds);
    }
  }

  /**
   * Retourne un "résumé" du nombre de notifications d'un utilisateur en fonction de filtres donnés
   * @param filters les filtres à appliquer
   * @return une promesse contenant le "résumé" du nombre de notifications
   */
  getMyBoardNotificationSummary(filters: MyBoardNotificationFilterModel): Promise<MyBoardNotificationSummaryModel> {
    return this.execFunctionService('getMyBoardNotificationSummary', filters);
  }
}
