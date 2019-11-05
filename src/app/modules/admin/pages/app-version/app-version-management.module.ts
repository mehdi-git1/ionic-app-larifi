import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../../../shared/components/components.module';
import { SharedModule } from '../../../../shared/shared.module';
import { AppVersionComponent } from './component/app-version/app-version.component';
import { AppVersionsComponent } from './component/app_versions/app-versions.component';
import { AppVersionCreatePage } from './page/app-version-create/app-version-create.page';
import { AppVersionListPage } from './page/app-version-list/app-version-list.page';

@NgModule({
    declarations: [
        AppVersionListPage,
        AppVersionCreatePage,
        AppVersionComponent,
        AppVersionsComponent
    ],
    imports: [
        IonicModule,
        SharedModule,
        ComponentsModule,
        FormsModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        AppVersionCreatePage
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: []
})

export class AppVersionManagementModule { }
