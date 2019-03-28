import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProfileManagementPage } from './profile-management.page';
import { TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';
import { UserPermissionService } from '../../../../core/services/user-permission/user-permission.service';
import { UserProfileService } from './../../../../core/services/user-profile/user-profile.service';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { UserPermissionModel } from '../../../../core/models/admin/user-permission.model';

const UserProfileServiceMock = jasmine.createSpyObj('UserProfileServiceMock', ['updatePermissions']);
const ToastServiceMock = jasmine.createSpyObj('ToastServiceMock', ['success']);

describe('page-profile-management', () => {

    let fixture: ComponentFixture<ProfileManagementPage>;
    let comp: ProfileManagementPage;
    let userProfileService: UserProfileService;
    let translateService: TranslateService;

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
                { provide: ToastService, useValue: ToastServiceMock },
                { provide: TranslateService, useClass: TranslateLoaderMock },
                { provide: UserProfileService, useValue: UserProfileServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(ProfileManagementPage);
        comp = fixture.componentInstance;
        translateService = TestBed.get(TranslateService);
        userProfileService = TestBed.get(UserProfileService);
    });

    let permission: UserPermissionModel;

    beforeEach(() => {
        permission = new UserPermissionModel();
        comp.profilePermissions = [new UserPermissionModel(), new UserPermissionModel()];
        comp.profilePermissions[0].name = 'VIEW_ALL_PNC';
        comp.profilePermissions[1].name = 'VIEW_PROFESSIONAL_LEVEL';
        comp.allPermissions = comp.profilePermissions;
    });

    describe('profileHasPermission', () => {


        it('doit retourner true si le profil possède la permission', () => {
            permission.name = 'VIEW_ALL_PNC';
            expect(comp.profileHasPermission(permission)).toBe(true);
        });

        it('doit retourner false si le profil possède la permission', () => {
            permission.name = 'VIEW_STATUTORY_CERTIFICATE';
            expect(comp.profileHasPermission(permission)).toBe(false);
        });
    });

    describe('updatePermissions', () => {

        beforeEach(() => {
            comp.allPermissions[0].checked = true;
            spyOn(translateService, 'instant').and.callFake(function (param) {
                return param;
            });
        });

        it(`doit mettre à jour la liste de permission pour un profil avec les bons paramètres et un toast de succes est affiché à l'écran de l'utilisateur`, () => {
            comp.updatePermissions();
            const tmpUser: UserPermissionModel = comp.allPermissions[0];
            tmpUser.name = 'VIEW_ALL_PNC';
            tmpUser.checked = true;
            expect(userProfileService.updatePermissions).toHaveBeenCalledWith(undefined, [tmpUser]);
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.PROFILE_MANAGEMENT.SUCCESS.PERMISSIONS_UPDATED');
        });
    });
});
