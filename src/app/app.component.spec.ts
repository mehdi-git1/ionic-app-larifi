import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { IonicModule, Platform, Nav, Events } from 'ionic-angular';

import { EDossierPNC } from './app.component';
import { TranslateLoaderMock, StatusBarMock, SplashScreenMock, PlatformMock } from '../test-config/mocks-ionic';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConnectivityService } from './core/services/connectivity/connectivity.service';
import { ModalSecurityService } from './core/services/modal/modal-security.service';
import { SessionService } from './core/services/session/session.service';
import { DeviceService } from './core/services/device/device.service';
import { ToastService } from './core/services/toast/toast.service';
import { SynchronizationService } from './core/services/synchronization/synchronization.service';
import { AuthenticationService } from './core/authentication/authentication.service';
import { StorageService } from './core/storage/storage.service';
import { AuthenticationStatusEnum } from './core/enums/authentication-status.enum';
import { AuthenticatedUserModel } from './core/models/authenticated-user.model';
import { PncHomePage } from './modules/home/pages/pnc-home/pnc-home.page';
import { GenericMessagePage } from './modules/home/pages/generic-message/generic-message.page';
import { ImpersonatePage } from './modules/settings/pages/impersonate/impersonate.page';
import { AuthenticationPage } from './modules/home/pages/authentication/authentication.page';


const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['']);
const authenticationServiceMock = jasmine.createSpyObj('authenticationServiceMock', ['initFonctionnalApp']);
const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isBrowser']);
const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);
const modalSecurityServiceMock = jasmine.createSpyObj('modalSecurityServiceMock', ['displayPinPad']);

describe('appComponent', () => {

    let fixture: ComponentFixture<EDossierPNC>;
    let comp: EDossierPNC;
    let navCtrl: Nav;
    let translateService: TranslateService;
    let events: Events;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EDossierPNC],
            imports: [
                IonicModule.forRoot(EDossierPNC),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: Platform, useClass: PlatformMock },
                { provide: StatusBar, useClass: StatusBarMock },
                { provide: SplashScreen, useClass: SplashScreenMock },
                { provide: ModalSecurityService, useValue: modalSecurityServiceMock },
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: StorageService },
                { provide: DeviceService, useValue: deviceServiceMock },
                { provide: ToastService },
                { provide: TranslateService, useClass: TranslateLoaderMock },
                { provide: SynchronizationService },
                { provide: AuthenticationService, useValue: authenticationServiceMock },
                { provide: ConnectivityService, useValue: connectivityServiceMock },
                Events
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(EDossierPNC);
        comp = fixture.componentInstance;
        translateService = TestBed.get(TranslateService);
        events = TestBed.get(Events);
    });

    describe('routingApp', () => {

        let tmpAuthUser: AuthenticatedUserModel;

        beforeEach(() => {
            tmpAuthUser = new AuthenticatedUserModel();
            tmpAuthUser.matricule = 'T778877';
            sessionServiceMock.impersonatedUser = tmpAuthUser;
            sessionServiceMock.getActiveUser.and.returnValue(tmpAuthUser);
            navCtrl = comp.nav;
            spyOn(navCtrl, 'setRoot').and.returnValue(true);
            spyOn(translateService, 'instant').and.callFake(function (param) {
                return param;
            });
        });

        it(`doit rediriger vers la page PncHomePage en cas d'AUTHENTIFICATION_OK`, () => {
            expect(comp).toBeDefined();
            comp.routingApp(AuthenticationStatusEnum.AUTHENTICATION_OK);
            expect(navCtrl.setRoot).toHaveBeenCalledWith(PncHomePage, { matricule: tmpAuthUser.matricule });
        });

        it(`doit publier user:authenticationDone en cas d'AUTHENTIFICATION_OK`, () => {
            spyOn(events, 'publish').and.returnValue(true);
            comp.routingApp(AuthenticationStatusEnum.AUTHENTICATION_OK);
            expect(events.publish).toHaveBeenCalledWith('user:authenticationDone');
        });

        it(`doit rediriger vers la page AuthenticationPage en cas d'AUTHENTICATION_KO`, () => {
            comp.routingApp(AuthenticationStatusEnum.AUTHENTICATION_KO);
            expect(navCtrl.setRoot).toHaveBeenCalledWith(AuthenticationPage);
        });

        it(`doit rediriger vers la page d'impersonnification en cas d'IMPERSONATE_MODE`, () => {
            comp.routingApp(AuthenticationStatusEnum.IMPERSONATE_MODE);
            expect(navCtrl.setRoot).toHaveBeenCalledWith(ImpersonatePage);
        });

        it(`doit rediriger vers la page GenericMessagePage en cas d'INIT_KO avec le message d'erreur suivant
        'GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'`, () => {
                comp.routingApp(AuthenticationStatusEnum.INIT_KO);
                expect(translateService.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED');
                expect(navCtrl.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });

        it(`doit rediriger vers la page GenericMessagePage en cas d'INIT_KO avec le message d'erreur suivant
        'GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE'`, () => {
                comp.routingApp(AuthenticationStatusEnum.APPLI_UNAVAILABLE);
                expect(translateService.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE');
                expect(navCtrl.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });

        it(`doit rediriger vers la page GenericMessagePage en cas de retour undefined avec le message d'erreur suivant
        'GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'`, () => {
                comp.routingApp(undefined);
                expect(translateService.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED');
                expect(navCtrl.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });
    });

});
