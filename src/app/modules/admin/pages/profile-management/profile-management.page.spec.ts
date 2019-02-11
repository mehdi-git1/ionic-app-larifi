import { UserProfileService } from './../../../../core/services/user-profile/user-profile.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProfileManagementPage } from './profile-management.page';
import { SessionService } from './../../../../core/services/session/session.service';
import { TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';
import { UserProfileModel } from './../../../../core/models/admin/user-profile.model';
import { UserPermissionModel } from './../../../../core/models/admin/user-permission.model';
import { UserPermissionService } from '../../../../core/services/user-permission/user-permission.service';

describe('page-profile-management', () => {

    let fixture: ComponentFixture<ProfileManagementPage>;
    let comp: ProfileManagementPage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProfileManagementPage
            ],
            imports: [
                IonicModule.forRoot(ProfileManagementPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: UserPermissionService },
                { provide: SessionService },
                { provide: UserProfileService },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(ProfileManagementPage);
        comp = fixture.componentInstance;
    });






});
