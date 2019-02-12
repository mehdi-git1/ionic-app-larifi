import { ProfileManagementPage } from './pages/profile-management/profile-management.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { AdminHomePage } from './pages/admin-home/admin-home.page';

@NgModule({
  declarations: [
    AdminHomePage,
    ProfileManagementPage
  ],
  imports: [
    [IonicPageModule.forChild(AdminHomePage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    AdminHomePage,
    ProfileManagementPage
  ],
  exports: [
    AdminHomePage,
    ProfileManagementPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class AdminModule { }
