import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

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
import { SessionService } from '../session/session.service';
import { OfflineMyBoardNotificationService } from './offline-my-board-notification.service';
import { OnlineMyBoardNotificationService } from './online-my-board-notification.service';

@Injectable({
  providedIn: 'root'
})
export class MyBoardNotificationService extends BaseService {

  constructor(
    public connectivityService: ConnectivityService,
    private sessionService: SessionService,
    private onlineService: OnlineMyBoardNotificationService,
    private offlineService: OfflineMyBoardNotificationService,
    private events: Events
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
    const promise = this.execFunctionService('getMyBoardNotificationSummary', filters);
    promise.then(myBoardNotificationSummary => {
      this.events.publish('myBoard:uncheckedNotificationCountUpdate', myBoardNotificationSummary.totalUncheckedNotifications + myBoardNotificationSummary.totalUncheckedAlerts);
    });
    return promise;
  }

  /**
   * Récupère le "résumé" myBoard de l'utilisateur actif, dans le but de mettre à jour le nombre de notifications MyBoard non lues
   */
  updateActiveUserMyBoardNotificationCount() {
    const myBoardNotificationFilter = new MyBoardNotificationFilterModel();
    myBoardNotificationFilter.notifiedPncMatricule = this.sessionService.getActiveUser().matricule;
    this.getMyBoardNotificationSummary(myBoardNotificationFilter);
  }

}
