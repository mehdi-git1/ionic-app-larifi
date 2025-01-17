import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { IdsModel } from '../../models/ids.model';
import {
    MyBoardNotificationFilterModel
} from '../../models/my-board/my-board-notification-filter.model';
import {
    MyBoardNotificationSummaryModel
} from '../../models/my-board/my-board-notification-summary.model';
import {
    PagedMyBoardNotificationModel
} from '../../models/my-board/paged-my-board-notification.model';

@Injectable({
  providedIn: 'root'
})
export class OnlineMyBoardNotificationService {

  constructor(
    private restService: RestService,
    public urlConfiguration: UrlConfiguration) { }

  /**
   * Récupère, en mode connecté, les notifications adressées au pnc
   * @param filters les filtres à appliquer à la requete
   * @return une promesse avec la liste des notifications
   */
  getNotifications(filters: MyBoardNotificationFilterModel): Promise<PagedMyBoardNotificationModel> {
    return this.restService.get(this.urlConfiguration.getBackEndUrl('getMyBoardNotification'), filters);
  }

  /**
   * Marque des notifications comme lues/non lues
   *
   * @param notificationIds les ids des notifications à marquer comme lues/non lues
   * @param isRead si les notifications doivent être marquées lues/non lues
   */
  readNotifications(notificationIds: Array<number>, isRead: boolean) {
    return this.restService.put(this.urlConfiguration.getBackEndUrl('readMyBoardNotifications', [isRead]), new IdsModel(notificationIds));
  }

  /**
   * Archive/désarchive une liste de notifications
   * @param notificationIds les ids des notifications à traiter
   * @param isArchived si les notifications doivent être archivées/désarchivées
   */
  archiveNotifications(notificationIds: Array<number>, isArchived: boolean) {
    return this.restService.put(this.urlConfiguration.getBackEndUrl('archiveNotifications', [isArchived]), new IdsModel(notificationIds));
  }

  /**
   * Supprime une liste de notifications
   * @param notificationIds les ids des notifications à supprimer
   */
  deleteNotifications(notificationIds: Array<number>) {
    return this.restService
      .post(this.urlConfiguration.getBackEndUrl('deleteNotifications'), new IdsModel(notificationIds));
  }

  /**
   * Retourne un "résumé" du nombre de notifications d'un utilisateur en fonction de filtres donnés
   * @param filters les filtres à appliquer
   * @return une promesse contenant le "résumé" du nombre de notifications
   */
  getMyBoardNotificationSummary(filters: MyBoardNotificationFilterModel): Promise<MyBoardNotificationSummaryModel> {
    return this.restService.get(this.urlConfiguration.getBackEndUrl('getMyBoardNotificationSummary'), filters);
  }
}
