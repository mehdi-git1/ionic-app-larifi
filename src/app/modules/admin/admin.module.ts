
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

import { AdminHomePage } from './pages/admin-home/admin-home.page';
import { AppVersionManagementPage } from './pages/app-version-management/app-version-management.page';
import { ProfileManagementPage } from './pages/profile-management/profile-management.page';

@NgModule({
  declarations: [
    AdminHomePage,
    ProfileManagementPage,
    AppVersionManagementPage
  ],
  imports: [
    [IonicPageModule.forChild(AdminHomePage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    AdminHomePage,
    ProfileManagementPage,
    AppVersionManagementPage
  ],
  exports: [
    AdminHomePage,
    ProfileManagementPage,
    AppVersionManagementPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class AdminModule { }
