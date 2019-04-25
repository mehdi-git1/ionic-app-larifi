import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, AlertController } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';
import { AppVersionManagementPage } from './app-version-management.page';
import { AppVersionService } from '../../../../core/services/app-version/app-version.service';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { AppVersionModel } from '../../../../core/models/admin/app-version.model';

const AppVersionServiceMock = jasmine.createSpyObj('AppVersionServiceMock', ['createOrUpdateAppVersion', 'getAllAppVersions', 'delete']);
AppVersionServiceMock.createOrUpdateAppVersion.and.returnValue(Promise.resolve());
AppVersionServiceMock.getAllAppVersions.and.returnValue(Promise.resolve());
AppVersionServiceMock.delete.and.returnValue(Promise.resolve());
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
                { provide: ToastService, useValue: ToastServiceMock },
                { provide: TranslateService, useClass: TranslateLoaderMock },
                { provide: AppVersionService, useValue: AppVersionServiceMock },
                AlertController
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(AppVersionManagementPage);
        comp = fixture.componentInstance;
        translateService = TestBed.get(TranslateService);
        appVersionService = TestBed.get(AppVersionService);
    });

    beforeEach(() => {
        comp.allAppVersions = [new AppVersionModel, new AppVersionModel];
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
            comp.createOrUpdateAppVersion(appVersion);
            // ASSERT le formulaire est invalide et un toast d'erreur est affiché à l'écran de l'utilisateur
            expect(comp.regEx.test(appVersion.number)).toBeFalsy();
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
            comp.createOrUpdateAppVersion(appVersion);
            tick();
            // ASSERT le formulaire est valide, la nouvelle version est intégrée et un toast de succes est affiché à l'écran de l'utilisateur
            const tmpAppVersion = new AppVersionModel();
            tmpAppVersion.number = validNumber;
            tmpAppVersion.changelog = validChangelog;
            expect(comp.regEx.test(tmpAppVersion.number)).toBeTruthy();
            expect(appVersionService.createOrUpdateAppVersion).toHaveBeenCalledWith(tmpAppVersion);
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATEORUPDATE_VERSION');
        }));
    });

    describe('deleteAppVersion', () => {

        beforeEach(() => {
            spyOn(translateService, 'instant').and.callFake(function (param) {
                return param;
            });
        });

        it(`doit envoyer un message indiquant la réussite de la suppression d'une version`, fakeAsync(() => {
            // ARRANGE Instanciation d'une version
            comp.allAppVersions[1].techId = 1;
            comp.allAppVersions[1].number = "1.0.0";
            comp.allAppVersions[1].changelog = "description de la version 1.0.0";
            // ACT appel de la fonction de suppression de version
            comp.delete(comp.allAppVersions[1]);
            tick();
            // ASSERT la version est supprimée et un toast de succes est affiché à l'écran de l'utilisateur
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.DELETE_UPDATE_VERSION');
        }));
    });
});