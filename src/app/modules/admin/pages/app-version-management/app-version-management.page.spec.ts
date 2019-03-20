import { AppVersion } from '@ionic-native/app-version';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavMock } from '../../../../../test-config/mocks-ionic';

import { AppVersionManagementPage } from './app-version-management.page';
import { TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';
import { AppVersionService } from '../../../../core/services/app-version/app-version.service';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { AppVersionModel } from '../../../../core/models/admin/app-version.model';

const AppVersionServiceMock = jasmine.createSpyObj('AppVersionServiceMock', ['create']);
const ToastServiceMock = jasmine.createSpyObj('ToastServiceMock', ['success', 'error']);

describe('app-version-management', () => {

    let fixture: ComponentFixture<AppVersionManagementPage>;
    let comp: AppVersionManagementPage;
    let appVersionService: AppVersionService;
    let translateService: TranslateService;
    let navCtrl: NavController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppVersionManagementPage
            ],
            imports: [
                IonicModule.forRoot(AppVersionManagementPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: ToastService, useValue: ToastServiceMock },
                { provide: TranslateService, useClass: TranslateLoaderMock },
                { provide: AppVersionService, useValue: AppVersionServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(AppVersionManagementPage);
        comp = fixture.componentInstance;
        translateService = TestBed.get(TranslateService);
        appVersionService = TestBed.get(AppVersionService);
        navCtrl = TestBed.get(NavController);
    });

    //  let appVersion: AppVersionModel;

    beforeEach(() => {
        comp.allAppVersions = [];
    });

    describe('createChangelog', () => {

        beforeEach(() => {
            spyOn(translateService, 'instant').and.callFake(function (param) {
                return param;
            });
        });

        it(`doit envoyer le message d'erreur ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER si le numero de version est null`, () => {
            comp.createChangelog(null, `changelog d'une version null`);
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER');
        });

        it(`doit appeler la fonction createChangelog(number,changelog) et envoyer le message 'ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_VERSION'`, () => {
            comp.createChangelog('1.0.0', 'description de la version 1.0.0');
            const tmpAppVersion: AppVersionModel = comp.allAppVersions[0];
            tmpAppVersion.number = '1.0.0';
            tmpAppVersion.changelog = 'description de la version 1.0.0';
            expect(appVersionService.create).toHaveBeenCalledWith(tmpAppVersion);
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_VERSION');
        });
    });
});
