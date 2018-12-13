import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { IonicModule, NavController, Events } from 'ionic-angular';

import { TranslateLoaderMock, NavMock } from '../../../../../test-config/mocks-ionic';
import { ModalSecurityService } from '../../../../core/services/modal/modal-security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { AuthenticatedUserModel } from '../../../../core/models/authenticated-user.model';
import { AuthenticationStatusEnum } from '../../../../core/enums/authentication-status.enum';
import { PncHomePage } from '../pnc-home/pnc-home.page';
import { GenericMessagePage } from '../generic-message/generic-message.page';
import { AuthenticationPage } from './authentication.page';
import { ImpersonatePage } from '../../../settings/pages/impersonate/impersonate.page';

const authenticationServiceMock = jasmine.createSpyObj('authenticationServiceMock', ['initFonctionnalApp']);
const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isBrowser']);
const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);
const modalSecurityServiceMock = jasmine.createSpyObj('modalSecurityServiceMock', ['displayPinPad']);

describe('authenticationPage', () => {

    let fixture: ComponentFixture<AuthenticationPage>;
    let comp: AuthenticationPage;
    let navCtrlService: NavController;
    let translateService: TranslateService;
    let events: Events;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AuthenticationPage],
            imports: [
                IonicModule.forRoot(AuthenticationPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: ModalSecurityService, useValue: modalSecurityServiceMock },
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: DeviceService, useValue: deviceServiceMock },
                { provide: ToastService },
                { provide: NavController, useClass: NavMock },
                { provide: TranslateService, useClass: TranslateLoaderMock },
                { provide: AuthenticationService, useValue: authenticationServiceMock },
                Events
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(AuthenticationPage);
        comp = fixture.componentInstance;
        translateService = TestBed.get(TranslateService);
        navCtrlService = TestBed.get(NavController);
        events = TestBed.get(Events);
    });

    describe('routingAuthent', () => {

        let tmpAuthUser: AuthenticatedUserModel;

        beforeEach(() => {
            tmpAuthUser = new AuthenticatedUserModel();
            tmpAuthUser.matricule = 'T778877';
            sessionServiceMock.impersonatedUser = tmpAuthUser;
            sessionServiceMock.getActiveUser.and.returnValue(tmpAuthUser);
            spyOn(navCtrlService, 'setRoot').and.returnValue(true);
            spyOn(translateService, 'instant').and.callFake(function (param) {
                return param;
            });
        });

        it(`doit rediriger vers la page PncHomePage en cas d'AUTHENTIFICATION_OK`, () => {
            expect(comp).toBeDefined();
            comp.routingAuthent(AuthenticationStatusEnum.AUTHENTICATION_OK);
            expect(navCtrlService.setRoot).toHaveBeenCalledWith(PncHomePage, { matricule: tmpAuthUser.matricule });
        });

        it(`doit rediriger vers la page d'impersonnification en cas d'IMPERSONATE_MODE`, () => {
            comp.routingAuthent(AuthenticationStatusEnum.IMPERSONATE_MODE);
            expect(navCtrlService.setRoot).toHaveBeenCalledWith(ImpersonatePage);
        });

        it(`doit publier user:authenticationDone en cas d'AUTHENTIFICATION_OK`, () => {
            spyOn(events, 'publish').and.returnValue(true);
            comp.routingAuthent(AuthenticationStatusEnum.AUTHENTICATION_OK);
            expect(events.publish).toHaveBeenCalledWith('user:authenticationDone');
        });

        it(`doit mettre la valeur GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS dans la variable errorMsg en cas d'AUTHENTICATION_KO`, () => {
            comp.routingAuthent(AuthenticationStatusEnum.AUTHENTICATION_KO);
            expect(translateService.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS');
            expect(comp.errorMsg).toBe('GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS');
        });

        it(`doit rediriger vers la page GenericMessagePage en cas d'INIT_KO avec le message d'erreur suivant
        'GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'`, () => {
                comp.routingAuthent(AuthenticationStatusEnum.INIT_KO);
                expect(translateService.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED');
                expect(navCtrlService.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });

        it(`doit rediriger vers la page GenericMessagePage en cas d'INIT_KO avec le message d'erreur suivant
        'GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE'`, () => {
                comp.routingAuthent(AuthenticationStatusEnum.APPLI_UNAVAILABLE);
                expect(translateService.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE');
                expect(navCtrlService.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });
    });

});
