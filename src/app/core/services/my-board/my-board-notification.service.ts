import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { MyBoardNotificationFilterModel } from '../../models/my-board/my-board-notification-filter.model';
import { MyBoardNotificationModel } from '../../models/my-board/my-board-notification.model';

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
  getNotificationByMatricule(matricule: string, filter: MyBoardNotificationFilterModel): Promise<MyBoardNotificationModel[]> {
    return null;
  }
}
