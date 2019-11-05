import {
    GenericMessagePage
} from '../../../modules/home/pages/generic-message/generic-message.page';
import { ImpersonatePage } from '../../../modules/settings/pages/impersonate/impersonate.page';
import { AuthenticationStatusEnum } from '../../enums/authentication-status.enum';
import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { AppInitService } from './app-init.service';

const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isBrowser']);
const routerMock = jasmine.createSpyObj('routerMock', ['navigate']);
const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);
const modalSecurityServiceMock = jasmine.createSpyObj('modalSecurityServiceMock', ['displayPinPad']);
const translateServiceMock = jasmine.createSpyObj('TranslateServiceMock', ['instant']);
const eventsMock = jasmine.createSpyObj('eventsMock', ['publish']);
const navCtrlMock = jasmine.createSpyObj('navCtrlMock', ['setRoot']);

describe('AppInitService', () => {

    const appInitService = new AppInitService(
        eventsMock,
        routerMock,
        deviceServiceMock,
        sessionServiceMock,
        modalSecurityServiceMock,
        translateServiceMock);

    beforeEach(() => {

    });

    describe('handleAuthenticationStatus', () => {


        describe('user is manager', () => {
            const managerUserMock = new AuthenticatedUserModel();

            beforeEach(() => {
                managerUserMock.matricule = '41414754';
                managerUserMock.isManager = true;
                sessionServiceMock.impersonatedUser = managerUserMock;
                sessionServiceMock.getActiveUser.and.returnValue(managerUserMock);
            });

            it(`doit rediriger vers la page d'impersonnification en cas d'IMPERSONATE_MODE`, () => {
                appInitService.handleAuthenticationStatus(AuthenticationStatusEnum.IMPERSONATE_MODE);
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(ImpersonatePage);
            });

            it(`doit publier user:authenticationDone en cas d'AUTHENTIFICATION_OK`, () => {
                appInitService.handleAuthenticationStatus(AuthenticationStatusEnum.AUTHENTICATION_OK);
                expect(eventsMock.publish).toHaveBeenCalledWith('user:authenticationDone');
            });

            it(`doit mettre la valeur GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS dans la variable errorMsg en cas d'AUTHENTICATION_KO`, () => {
                appInitService.handleAuthenticationStatus(AuthenticationStatusEnum.AUTHENTICATION_KO);
            });

            it(`doit rediriger vers la page GenericMessagePage en cas d'INIT_KO avec le message d'erreur suivant 'GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'`, () => {
                appInitService.handleAuthenticationStatus(AuthenticationStatusEnum.INIT_KO);
                expect(translateServiceMock.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED');
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });

            it(`doit rediriger vers la page GenericMessagePage en cas d'INIT_KO avec le message d'erreur suivant 'GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE'`, () => {
                appInitService.handleAuthenticationStatus(AuthenticationStatusEnum.APPLI_UNAVAILABLE);
                expect(translateServiceMock.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE');
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });

            it(`doit rediriger vers la page GenericMessagePage en cas de retour undefined avec le message d'erreur suivant 'GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'`, () => {
                appInitService.handleAuthenticationStatus(undefined);
                expect(translateServiceMock.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED');
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });
        });
    });



});
