import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { MyBoardNotificationFilter } from '../../models/my-board/my-board-notification-filter';
import { MyBoardNotification } from '../../models/my-board/my-board-notification';

@Injectable({
  providedIn: 'root'
})
export class MyBoardNotificationService {

  constructor(public connectivityService: ConnectivityService) {

  }

  /**
   * Récupère les notifications adressées au pnc
   *
   * @param matricule le matricule du pnc
   * @param filter les filtres à appliquer à la requete
   * @return une promesse avec la liste des notifications
   */
  getNotificationByMatricule(matricule: string, filter: MyBoardNotificationFilter): Promise<MyBoardNotification[]> {
    return null;
  }
}
