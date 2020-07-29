import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';

export class MyBoardNotificationModel extends EDossierPncObjectModel {
  documentType: NotificationDocumentTypeEnum;
  documentId: number;
  concernedPnc: PncModel;
  notifiedPnc: PncModel;
  title: string;
  checked: boolean;
  creationDate: Date;

  getStorageId(): string {
    return `${this.techId}`;
  }
}
