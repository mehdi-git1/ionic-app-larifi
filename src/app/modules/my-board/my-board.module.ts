import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MyBoardFiltersComponent } from './components/my-board-filters/my-board-filters.component';
import {
    MyBoardNotificationCardComponent
} from './components/my-board-notification-card/my-board-notification-card.component';
import {
    MyBoardNotificationsListComponent
} from './components/my-board-notifications-list/my-board-notifications-list.component';
import { MyBoardHomePage } from './pages/my-board-home/my-board-home.page';

@NgModule({
  declarations: [
    MyBoardNotificationsListComponent,
    MyBoardNotificationCardComponent,
    MyBoardFiltersComponent,
    MyBoardHomePage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    InfiniteScrollModule
  ],
  exports: [
    MyBoardHomePage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyBoardModule { }
