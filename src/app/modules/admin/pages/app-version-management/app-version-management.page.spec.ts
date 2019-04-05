import { AppVersion } from '@ionic-native/app-version';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';

import { AppVersionManagementPage } from './app-version-management.page';

import { AppVersionService } from '../../../../core/services/app-version/app-version.service';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { AppVersionModel } from '../../../../core/models/admin/app-version.model';

const AppVersionServiceMock = jasmine.createSpyObj('AppVersionServiceMock', ['createOrUpdateAppVersion', 'getAllAppVersions']);
AppVersionServiceMock.createOrUpdateAppVersion.and.returnValue(Promise.resolve());
AppVersionServiceMock.getAllAppVersions.and.returnValue(Promise.resolve());
const ToastServiceMock = jasmine.createSpyObj('ToastServiceMock', ['success', 'error']);

describe('app-version-management', () => {

    let fixture: ComponentFixture<AppVersionManagementPage>;
    let appVersionManagementPage: AppVersionManagementPage;
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
                { provide: ToastService, useValue: ToastServiceMock },
                { provide: TranslateService, useClass: TranslateLoaderMock },
                { provide: AppVersionService, useValue: AppVersionServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(AppVersionManagementPage);
        appVersionManagementPage = fixture.componentInstance;
        translateService = TestBed.get(TranslateService);
        appVersionService = TestBed.get(AppVersionService);
    });

    beforeEach(() => {
        appVersionManagementPage.allAppVersions = [];
    });

    describe('createOrUpdateAppVersion', () => {

        beforeEach(() => {

            spyOn(translateService, 'instant').and.callFake(function (param) {
                return param;
            });

        });
        let invalidNumber, validNumber: string;
        let invalidChangelog, validChangelog: string;
        let appVersion: AppVersionModel;

        it(`doit envoyer un message d'erreur si le numero de version n'est pas conforme`, () => {
            // ARRANGE remplissage du formulaire avec un numéro de version vide (donc invalide) et un changelog (aucun contrôle n'est effectué dessus)
            invalidNumber = '';
            invalidChangelog = `changelog d'une version invalide`;
            appVersion = new AppVersionModel();
            appVersion.number = invalidNumber;
            appVersion.changelog = invalidChangelog;
            // ACT utilisation de la fonction de création de version
            appVersionManagementPage.createOrUpdateAppVersion(appVersion);
            // ASSERT le formulaire est invalide et un toast d'erreur est affiché à l'écran de l'utilisateur
            expect(appVersionManagementPage.versionNumberRegex.test(appVersion.number)).toBeFalsy();
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER');
        });

        it(`doit envoyer un message indiquant la réussite de la création d'une version`, fakeAsync(() => {
            // ARRANGE remplissage du formulaire avec un numéro de version valide et un changelog
            validChangelog = `description de la version 1.0.0`;
            validNumber = '1.0.0';
            appVersion = new AppVersionModel();
            appVersion.number = validNumber;
            appVersion.changelog = validChangelog;
            // ACT utilisation de la fonction de création de version
            appVersionManagementPage.createOrUpdateAppVersion(appVersion);
            tick();
            // ASSERT le formulaire est valide, la nouvelle version est intégrée et un toast de succes est affiché à l'écran de l'utilisateur
            const tmpAppVersion = new AppVersionModel();
            tmpAppVersion.number = validNumber;
            tmpAppVersion.changelog = validChangelog;
            expect(appVersionManagementPage.versionNumberRegex.test(tmpAppVersion.number)).toBeTruthy();
            expect(appVersionService.createOrUpdateAppVersion).toHaveBeenCalledWith(tmpAppVersion);
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATEORUPDATE_VERSION');
        }));
    });
});
