import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { IdsModel } from '../../models/ids.model';
import {
    MyBoardNotificationFilterModel
} from '../../models/my-board/my-board-notification-filter.model';
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
   * Marque une notification comme lue
   *
   * @param notificationId l'id de la notification à marquer comme lue
   * @param isRead si la notification doit être marquée lue/non lue
   */
  readNotification(notificationId: number, isRead: boolean) {
    return this.restService.put(this.urlConfiguration.getBackEndUrl('readMyBoardNotification', [notificationId, isRead]), null);
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
}
