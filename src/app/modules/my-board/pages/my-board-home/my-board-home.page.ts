import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';
import { PncModel } from 'src/app/core/models/pnc.model';
import { SecurityService } from 'src/app/core/services/security/security.service';

import { Component, OnInit } from '@angular/core';

import { AppConstant } from '../../../../app.constant';
import { MyBoardNotificationFilterModel } from '../../../../core/models/my-board/my-board-notification-filter.model';
import { MyBoardNotificationService } from '../../../../core/services/my-board/my-board-notification.service';

@Component({
  selector: 'my-board-home',
  templateUrl: './my-board-home.page.html',
  styleUrls: ['./my-board-home.page.scss'],
})
export class MyBoardHomePage implements OnInit {
  pnc: PncModel;
  pncNotifications: MyBoardNotificationModel[];
  filter: MyBoardNotificationFilterModel;

  constructor(
    private securityService: SecurityService,
    private myBoardNotificationService: MyBoardNotificationService
  ) { }

  ngOnInit() {
    this.pncNotifications = new Array();
    this.securityService.getAuthenticatedUser().then((authenticated) => {
      this.pnc = authenticated.authenticatedPnc;

      this.filter = new MyBoardNotificationFilterModel();
      this.filter.notifiedPncMatricule = '42414258';

      this.filter.offset = 0;
      this.filter.page = 0;
      this.filter.size = AppConstant.pageSize;
      this.getPncNotifications(this.filter);
    });
  }

  /**
   * charge les données supplémentaires
   * @param event evenement déclenché
   */
  loadMoreData(event) {
    this.filter.page += 1;
    this.filter.offset = this.filter.page * this.filter.size;
    this.getPncNotifications(this.filter);
    event.target.complete();
  }

  /**
   * recupérè les notifications correspondants au filtre.
   * @param filter le filtre à appliquer à la requete
   */
  getPncNotifications(filter: MyBoardNotificationFilterModel): void {
    this.myBoardNotificationService
      .getNotifications(filter)
      .then((pagedNotification) => {
        this.pncNotifications = this.pncNotifications.concat(pagedNotification.content);
        this.filter.page = pagedNotification.page.number;
      });
  }
}
