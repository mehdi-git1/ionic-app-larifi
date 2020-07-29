import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
    NotificationDocumentTypeEnum
} from '../../../../core/enums/my-board/notification-document-type.enum';

@Component({
  selector: 'my-board-notifications-list',
  templateUrl: './my-board-notifications-list.component.html',
  styleUrls: ['./my-board-notifications-list.component.scss'],
})
export class MyBoardNotificationsListComponent implements OnInit {

  @Input() notificationList: MyBoardNotificationModel[];

  @Output() notificationClicked = new EventEmitter<MyBoardNotificationModel>();

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
  }

  /**
   * Determine s'il y a des données à afficher.
   * @return true si oui, false si non.
   */
  dataToDisplay(): boolean {
    return (this.notificationList && this.notificationList.length > 0);
  }
  /**
   * Récupère le libellé du type document dans la locale
   * @param documentType type de document concerné par la notification
   * @return la traduction
   */
  getDocumentTypeTranslation(documentType: NotificationDocumentTypeEnum): string {
    return this.translateService.instant('MY_BOARD.DOCUMENT_TYPE.'.concat(documentType.toString()));
  }

  /**
   * retourne la classe css à appliquer pour le type de document passé en paramètre.
   *
   * @param documentType type de document concerné par la notification
   * @return la classe css
   */
  getClass(documentType: NotificationDocumentTypeEnum): string {
    return documentType.toString().toLocaleLowerCase();
  }

  /**
   * Indique au composant parent qu'une notification a été cliquée
   * @param notification la notification cliquée
   */
  openNotification(notification: MyBoardNotificationModel) {
    this.notificationClicked.emit(notification);
  }

}
