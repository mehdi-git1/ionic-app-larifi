import { AppConstant } from './../../../../app.constant';
import { MyBoardNotificationFilterModel } from './../../../../core/models/my-board/my-board-notification-filter.model';
import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';
import { MyBoardNotificationService } from './../../../../core/services/my-board/my-board-notification.service';
import { Component, OnInit } from '@angular/core';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { PncModel } from 'src/app/core/models/pnc.model';
import { SecurityService } from 'src/app/core/services/security/security.service';

@Component({
  selector: 'my-board-home',
  templateUrl: './my-board-home.page.html',
  styleUrls: ['./my-board-home.page.scss'],
})
export class MyBoardHomePage implements OnInit {
  pnc: PncModel;
  pncNotifications: MyBoardNotificationModel[];
  filter: MyBoardNotificationFilterModel;

  constructor(private securityService: SecurityService, private myBoardNotificationService: MyBoardNotificationService) { }

  ngOnInit() {
    this.securityService.getAuthenticatedUser().then(authenticated => {
      this.pnc = authenticated.authenticatedPnc;

      this.filter = new MyBoardNotificationFilterModel();
      this.filter.notifiedPncMatricule = '42414258';

      this.filter.offset = 0;
      this.filter.page = 0;
      this.filter.size = AppConstant.pageSize;
      this.myBoardNotificationService.getNotifications(this.filter).then(pagedNotification => {
        this.pncNotifications = pagedNotification.content;
      });
    });

  }

}
