import { Component, OnInit, Input } from '@angular/core';
import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';

@Component({
  selector: 'app-my-board-notifications-list',
  templateUrl: './my-board-notifications-list.component.html',
  styleUrls: ['./my-board-notifications-list.component.scss'],
})
export class MyBoardNotificationsListComponent implements OnInit {

  @Input()
  notificationList: MyBoardNotificationModel[];

  constructor() { }

  ngOnInit() { }

}
