import { MyBoardNotificationTypeEnum } from './../../enums/my-board/my-board-notification-type.enum';
import { Type } from '@angular/core';
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
  type: MyBoardNotificationTypeEnum;

  // Transient
  selected: boolean;

  getStorageId(): string {
    return `${this.techId}`;
  }
}
