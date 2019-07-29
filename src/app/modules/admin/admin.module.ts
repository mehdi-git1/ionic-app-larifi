import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

import { ProfileManagementPage } from './pages/profile-management/profile-management.page';
import { UserMessageManagementPage } from './pages/user-message-management/user-message-management.page';
import { AppVersionManagementModule } from './pages/app-version/app-version-management.module';

@NgModule({
  declarations: [
    ProfileManagementPage,
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
    ComponentsModule,
    AppVersionManagementModule
  ],
  entryComponents: [
    ProfileManagementPage,
    UserMessageManagementPage
  ],
  exports: [
    ProfileManagementPage,
    UserMessageManagementPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class AdminModule { }
