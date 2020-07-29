

import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import {
    MyBoardNotificationFilterModel
} from '../../models/my-board/my-board-notification-filter.model';
import {
    PagedMyBoardNotificationModel
} from '../../models/my-board/paged-my-board-notification.model';

@Injectable({
  providedIn: 'root'
})
export class MyBoardNotificationOnlineService {

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
   */
  readNotification(notificationId: number) {
    return this.restService.put(this.urlConfiguration.getBackEndUrl('readMyBoardNotification', [notificationId]), null);
  }
}
