import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';

import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
    NotificationDocumentTypeEnum
} from '../../../../core/enums/my-board/notification-document-type.enum';

@Component({
  selector: 'my-board-notification-card',
  templateUrl: './my-board-notification-card.component.html',
  styleUrls: ['./my-board-notification-card.component.scss'],
})
export class MyBoardNotificationCardComponent {

  @Input() notification: MyBoardNotificationModel;

  constructor(private translateService: TranslateService) { }

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
   * Sélectionne/déselectionne une notification
   * @param notification la notification sélectionnée
   * @param event l'événement émis
   */
  selectNotification(notification: MyBoardNotificationModel, event) {
    notification.selected = !notification.selected;
    event.stopPropagation();
  }
}
