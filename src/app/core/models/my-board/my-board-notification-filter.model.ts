import { MyBoardNotificationTypeEnum } from './../../enums/my-board/my-board-notification-type.enum';
import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';
import { PagePositionEnum } from '../../enums/page-position.enum';
import { SortDirection } from '../../enums/sort-direction-enum';

export class MyBoardNotificationFilterModel {
  notifiedPncMatricule: string;
  documentTypes: Array<NotificationDocumentTypeEnum>;
  type: MyBoardNotificationTypeEnum;

  creationStartDate: string;
  creationEndDate: string;

  archived: boolean;
  checked: boolean;

  // Tri
  sortColumn: string;
  sortDirection: SortDirection;

  // Page
  size: number;
  page: number;
  offset: number;
  pagePosition: PagePositionEnum;

}
