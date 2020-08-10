import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';
import { SortDirection } from '../../enums/sort-direction-enum';

export class MyBoardNotificationFilterModel {
  notifiedPncMatricule: string;
  documentTypes: Array<NotificationDocumentTypeEnum>;

  creationStartDate: string;
  creationEndDate: string;

  // Tri
  sortColumn: string;
  sortDirection: SortDirection;

  // Page
  size: number;
  page: number;
  offset: number;

}
