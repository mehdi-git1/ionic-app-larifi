import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'my-board-notifications-list',
  templateUrl: './my-board-notifications-list.component.html',
  styleUrls: ['./my-board-notifications-list.component.scss'],
})
export class MyBoardNotificationsListComponent {

  @Input() notificationList: Array<MyBoardNotificationModel>;

  @Output() notificationClicked = new EventEmitter<MyBoardNotificationModel>();

  constructor() { }

  /**
   * Determine s'il y a des données à afficher.
   * @return true si oui, false si non.
   */
  dataToDisplay(): boolean {
    return (this.notificationList && this.notificationList.length > 0);
  }

  /**
   * Indique au composant parent qu'une notification a été cliquée
   * @param notification la notification cliquée
   */
  openNotification(notification: MyBoardNotificationModel) {
    this.notificationClicked.emit(notification);
  }

}
