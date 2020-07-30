import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';
import { SortDirection } from '../../enums/sort-direction-enum';

export class MyBoardNotificationFilterModel {
  creationDate: Date;
  notifiedPncMatricule: string;
  concernedPncMatricule: string;
  documentType: NotificationDocumentTypeEnum;
  sortColumn: string;
  sortDirection: SortDirection;

  // Page
  size: number;
  page: number;
  offset: number;

}
