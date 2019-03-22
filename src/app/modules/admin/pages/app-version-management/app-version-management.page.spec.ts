import { AppVersion } from '@ionic-native/app-version';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';

import { AppVersionManagementPage } from './app-version-management.page';

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
                FormBuilder,
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

        let invalidNumber, validNumber: string;
        let invalidChangelog, validChangelog: string;

        it(`doit envoyer le message d'erreur ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER si le numero de version n'est pas conforme`, () => {
            invalidNumber = '';
            invalidChangelog = `changelog d'une version invalide`;
            comp.appVersionForm.setValue({ number: invalidNumber, changelog: invalidChangelog });
            comp.createChangelog(invalidNumber, invalidChangelog);
            expect(comp.appVersionForm.valid).toBeFalsy();
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER');
        });

        it(`doit appeler la fonction createChangelog(number,changelog) et envoyer le message 'ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_VERSION'`, () => {
            validNumber = '1.0.0';
            validChangelog = `description de la version 1.0.0`;
            comp.appVersionForm.setValue({ number: validNumber, changelog: validChangelog });
            comp.createChangelog(validNumber, validChangelog);
            const tmpAppVersion: AppVersionModel = comp.allAppVersions[0];
            tmpAppVersion.number = validNumber;
            tmpAppVersion.changelog = validChangelog;
            expect(appVersionService.create).toHaveBeenCalledWith(tmpAppVersion);
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_VERSION');
        });
    });
});
