import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { AppVersionManagementModule } from './pages/app-version/app-version-management.module';
import { ProfileManagementPage } from './pages/profile-management/profile-management.page';
import {
    UserMessageManagementPage
} from './pages/user-message-management/user-message-management.page';

@NgModule({
  declarations: [
    ProfileManagementPage,
    UserMessageManagementPage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    AppVersionManagementModule,
    FormsModule,
    ReactiveFormsModule
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
  providers: [AppVersion]
})

export class AdminModule { }
