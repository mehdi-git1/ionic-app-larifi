import { AppVersion } from '@ionic-native/app-version';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';

import { AppVersionManagementPage } from './app-version-management.page';

import { AppVersionService } from '../../../../core/services/app-version/app-version.service';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { AppVersionModel } from '../../../../core/models/admin/app-version.model';

const AppVersionServiceMock = jasmine.createSpyObj('AppVersionServiceMock', ['createAppVersion', 'getAllAppVersions']);
AppVersionServiceMock.createAppVersion.and.returnValue(Promise.resolve());
AppVersionServiceMock.getAllAppVersions.and.returnValue(Promise.resolve());
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

    beforeEach(() => {
        comp.allAppVersions = [];
    });

    describe('createAppVersion', () => {

        beforeEach(() => {
            spyOn(translateService, 'instant').and.callFake(function (param) {
                return param;
            });

        });

        let invalidNumber, validNumber: string;
        let invalidChangelog, validChangelog: string;

        it(`doit envoyer un message d'erreur si le numero de version n'est pas conforme`, () => {
            // ARRANGE remplissage du formulaire avec un numéro de version vide (donc invalide) et un changelog (aucun contrôle n'est effectué dessus)
            invalidNumber = '';
            invalidChangelog = `changelog d'une version invalide`;
            comp.appVersionForm.setValue({ number: invalidNumber, changelog: invalidChangelog });
            // ACT utilisation de la fonction de création de version
            comp.createAppVersion();
            // ASSERT le formulaire est invalide et un toast d'erreur est affiché à l'écran de l'utilisateur
            expect(comp.appVersionForm.valid).toBeFalsy();
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER');
        });

        it(`doit envoyer un message indiquant la réussite de la création d'une version`, fakeAsync(() => {
            // ARRANGE remplissage du formulaire avec un numéro de version valide et un changelog
            validChangelog = `description de la version 1.0.0`;
            validNumber = '1.0.0';
            comp.appVersionForm.setValue({ number: validNumber, changelog: validChangelog });
            // ACT utilisation de la fonction de création de version
            comp.createAppVersion();
            tick();
            // ASSERT le formulaire est valide, la nouvelle version est intégrée et un toast de succes est affiché à l'écran de l'utilisateur
            const tmpAppVersion = new AppVersionModel();
            tmpAppVersion.number = validNumber;
            tmpAppVersion.changelog = validChangelog;
            expect(comp.appVersionForm.valid).toBeTruthy();
            expect(appVersionService.createAppVersion).toHaveBeenCalledWith(tmpAppVersion);
            expect(translateService.instant).toHaveBeenCalledWith('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_VERSION');
        }));
    });
});
