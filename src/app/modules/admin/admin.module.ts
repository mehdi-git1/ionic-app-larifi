import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

import { AdminHomePage } from './pages/admin-home/admin-home.page';
import { AppVersionManagementPage } from './pages/app-version-management/app-version-management.page';
import { ProfileManagementPage } from './pages/profile-management/profile-management.page';
import { UserMessageManagementPage } from './pages/user-message-management/user-message-management.page';

@NgModule({
  declarations: [
    AdminHomePage,
    ProfileManagementPage,
    AppVersionManagementPage,
    UserMessageManagementPage
  ],
  imports: [
    IonicModule.forRoot(AdminHomePage, {
      menuType: 'push',
      platform: {
        ios: {
          menuType: 'overlay',
        }
      }
    }),
    [IonicPageModule.forChild(AdminHomePage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    AdminHomePage,
    ProfileManagementPage,
    AppVersionManagementPage,
    UserMessageManagementPage
  ],
  exports: [
    AdminHomePage,
    ProfileManagementPage,
    AppVersionManagementPage,
    UserMessageManagementPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class AdminModule { }
