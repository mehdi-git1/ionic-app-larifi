import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';
import { PncModel } from '../pnc.model';
import { SpecialityEnum } from '../../enums/speciality.enum';

export class MyBoardNotificationModel {
  techid: number;
  documentType: NotificationDocumentTypeEnum;
  documentId: number;
  concernedPnc: PncModel;
  notifiedPnc: PncModel;
  title: string;
  checked: boolean;
  creationDate: Date;
}
