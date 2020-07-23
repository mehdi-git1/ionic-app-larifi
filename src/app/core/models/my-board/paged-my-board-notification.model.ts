import { PageModel } from './../page.model';
import { MyBoardNotificationModel } from 'src/app/core/models/my-board/my-board-notification.model';
export class PagedMyBoardNotificationModel {
    content: MyBoardNotificationModel[];
    page: PageModel;
}
