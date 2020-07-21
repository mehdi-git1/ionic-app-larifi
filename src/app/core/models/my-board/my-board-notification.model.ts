import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';
import { PncModel } from '../pnc.model';

export class MyBoardNotificationModel {
  techid: number;
  documentType: NotificationDocumentTypeEnum;
  documentId: number;
  concerned: PncModel;
  notifiedPnc: PncModel;
  title: string;
  checked: boolean;
  creationDate: Date;
}
