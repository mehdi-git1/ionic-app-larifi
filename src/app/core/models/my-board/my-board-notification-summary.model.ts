import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class MyBoardNotificationSummaryModel extends EDossierPncObjectModel {
  matricule: string;
  lastMyBoardNotification: MyBoardNotificationModel;
  totalFiltered: number;
  totalArchivedNotifcations: number;
  totalArchivedAlerts: number;
  totalUncheckedNotifications: number;
  totalUncheckedAlerts: number;

  getStorageId(): string {
    return `${this.matricule}`;
  }
}
