import { AppVersionsComponent } from './component/app_versions/app-versions.component';
import { AppVersionComponent } from './component/app-version/app-version.component';
import { AppVersionCreatePage } from './page/app-version-create/app-version-create.page';
import { SharedModule } from './../../../../shared/shared.module';
import { ComponentsModule } from './../../../../shared/components/components.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppVersionListPage } from './page/app-version-list/app-version-list.page';


@NgModule({
    declarations: [
        AppVersionListPage,
        AppVersionCreatePage,
        AppVersionComponent,
        AppVersionsComponent
    ],
    imports: [
        [IonicPageModule.forChild(AppVersionListPage)],
        SharedModule,
        ComponentsModule
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
