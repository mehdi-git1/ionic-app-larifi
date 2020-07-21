import { DocumentTypeEnum } from '../document.model';
import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';

export class MyBoardNotificationFilterModel {
  creationDate: Date;
  notifiedPncMatricule: string;
  concernedPncMatricule: string;
  documentType: NotificationDocumentTypeEnum;
}
