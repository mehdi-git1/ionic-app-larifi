import { UserMessageManagementPage } from './pages/user-message-management/user-message-management.page';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

import { AppVersionManagementPage } from './pages/app-version-management/app-version-management.page';
import { ProfileManagementPage } from './pages/profile-management/profile-management.page';

@NgModule({
  declarations: [
    ProfileManagementPage,
    AppVersionManagementPage,
    UserMessageManagementPage
  ],
  imports: [
    IonicModule.forRoot(ProfileManagementPage, {
      menuType: 'push',
      platform: {
        ios: {
          menuType: 'overlay',
        }
      }
    }),
    [IonicPageModule.forChild(ProfileManagementPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    ProfileManagementPage,
    AppVersionManagementPage,
    UserMessageManagementPage
  ],
  exports: [
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
