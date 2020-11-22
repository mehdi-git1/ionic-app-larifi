import { MyBoardNotificationFilterModel } from './my-board/my-board-notification-filter.model';
import { MyBoardFiltersComponent } from './../../modules/my-board/components/my-board-filters/my-board-filters.component';
import { MyBoardNotificationModel } from './my-board/my-board-notification.model';
import { RotationModel } from './rotation.model';

export class AppContextModel {
    lastConsultedRotation: RotationModel;
    onBoardRedactorFunction: string;
    onBoardObservedPncFunction: string;

    myBoardNotificationFilters: MyBoardNotificationFilterModel;
    myBoardAlertFilters: MyBoardNotificationFilterModel;
}
