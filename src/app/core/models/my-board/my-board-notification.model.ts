import { NotificationDocumentTypeEnum } from '../../enums/my-board/notification-document-type.enum';
import { PncModel } from '../pnc.model';
import { SpecialityEnum } from '../../enums/speciality.enum';

export class MyBoardNotificationModel {
  techid: number;
  documentType: NotificationDocumentTypeEnum;
  documentId: number;
  concerned: PncModel;
  notifiedPnc: PncModel;
  title: string;
  checked: boolean;
  creationDate: Date;

  constructor() {
    this.documentType = NotificationDocumentTypeEnum.CONGRATULATION_LETTER;
    this.title = 'Félicitations individuelles - AF1452 du 17/07/2020 par ABABSA Shirley';
    this.concerned = new PncModel();
    this.notifiedPnc = new PncModel();
    this.concerned.firstName = 'Shirley';
    this.concerned.lastName = 'ABABSA';
    this.concerned.matricule = '53673844';
    this.concerned.currentSpeciality = SpecialityEnum.HOT;
    this.notifiedPnc.firstName = 'Mohamed Caso';
    this.notifiedPnc.lastName = 'CAMARA';
    this.notifiedPnc.matricule = '42615534';
    this.creationDate = new Date();
  }
}
