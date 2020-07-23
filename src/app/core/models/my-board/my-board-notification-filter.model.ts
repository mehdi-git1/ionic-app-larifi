import { SortDirection } from './../../enums/sort-direction-enum';
import { DocumentTypeEnum } from '../document.model';
import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';

export class MyBoardNotificationFilterModel {
  creationDate: Date;
  notifiedPncMatricule: string;
  concernedPncMatricule: string;
  documentType: NotificationDocumentTypeEnum;
  sortColumn: string;
  sortDirection: SortDirection;

  //page
  size: number;
  page: number;
  offset: number;

}
