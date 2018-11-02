import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from './../../shared/shared.module';
import { AdminHomePage } from './home/home';
import { ComponentsModule } from './../../components/components.module';

@NgModule({
    declarations: [
        AdminHomePage
    ],
    imports: [
        [IonicPageModule.forChild(AdminHomePage)],
        SharedModule,
        ComponentsModule
    ],
    entryComponents: [
        AdminHomePage
    ],
    exports: [
        AdminHomePage
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: []
})
export class AdminModule { }
