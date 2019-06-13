import { CareerObjectiveListPage } from './../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { GenericMessagePage } from './../../modules/home/pages/generic-message/generic-message.page';
import { ImpersonatePage } from './../../modules/settings/pages/impersonate/impersonate.page';
import { PncHomePage } from './../../modules/home/pages/pnc-home/pnc-home.page';
import { AuthenticationStatusEnum } from './../enums/authentication-status.enum';
import { AuthenticatedUserModel } from './../models/authenticated-user.model';
import { RoutingService } from './routing.service';


const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isBrowser']);
const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);
const modalSecurityServiceMock = jasmine.createSpyObj('modalSecurityServiceMock', ['displayPinPad']);
const translateServiceMock = jasmine.createSpyObj('TranslateServiceMock', ['instant']);
const eventsMock = jasmine.createSpyObj('eventsMock', ['publish']);
const navCtrlMock = jasmine.createSpyObj('navCtrlMock', ['setRoot']);

describe('RoutingService', () => {

    const routingService: RoutingService = new RoutingService(eventsMock, deviceServiceMock, sessionServiceMock, modalSecurityServiceMock, translateServiceMock);

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

            it(`doit rediriger vers la page PncHomePage en cas d'AUTHENTIFICATION_OK`, () => {
                routingService.handleAuthenticationStatus(AuthenticationStatusEnum.AUTHENTICATION_OK, navCtrlMock);
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(PncHomePage, { matricule: managerUserMock.matricule });
            });

            it(`doit rediriger vers la page d'impersonnification en cas d'IMPERSONATE_MODE`, () => {
                routingService.handleAuthenticationStatus(AuthenticationStatusEnum.IMPERSONATE_MODE, navCtrlMock);
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(ImpersonatePage);
            });

            it(`doit publier user:authenticationDone en cas d'AUTHENTIFICATION_OK`, () => {
                routingService.handleAuthenticationStatus(AuthenticationStatusEnum.AUTHENTICATION_OK, navCtrlMock);
                expect(eventsMock.publish).toHaveBeenCalledWith('user:authenticationDone');
            });

            it(`doit mettre la valeur GLOBAL.MESSAGES.ERROR.INVALID_CREDENTIALS dans la variable errorMsg en cas d'AUTHENTICATION_KO`, () => {
                routingService.handleAuthenticationStatus(AuthenticationStatusEnum.AUTHENTICATION_KO, navCtrlMock);
            });

            it(`doit rediriger vers la page GenericMessagePage en cas d'INIT_KO avec le message d'erreur suivant 'GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'`, () => {
                routingService.handleAuthenticationStatus(AuthenticationStatusEnum.INIT_KO, navCtrlMock);
                expect(translateServiceMock.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED');
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });

            it(`doit rediriger vers la page GenericMessagePage en cas d'INIT_KO avec le message d'erreur suivant 'GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE'`, () => {
                routingService.handleAuthenticationStatus(AuthenticationStatusEnum.APPLI_UNAVAILABLE, navCtrlMock);
                expect(translateServiceMock.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE');
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });

            it(`doit rediriger vers la page GenericMessagePage en cas de retour undefined avec le message d'erreur suivant 'GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'`, () => {
                routingService.handleAuthenticationStatus(undefined, navCtrlMock);
                expect(translateServiceMock.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED');
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(GenericMessagePage, jasmine.any(Object));
            });

        });

        describe('user is pnc', () => {
            const pncUserMock = new AuthenticatedUserModel();

            beforeEach(() => {
                pncUserMock.matricule = '41414754';
                pncUserMock.isManager = false;
                sessionServiceMock.impersonatedUser = pncUserMock;
                sessionServiceMock.getActiveUser.and.returnValue(pncUserMock);
            });

            it(`doit rediriger vers la page PncHomePage en cas d'AUTHENTIFICATION_OK`, () => {
                routingService.handleAuthenticationStatus(AuthenticationStatusEnum.AUTHENTICATION_OK, navCtrlMock);
                expect(navCtrlMock.setRoot).toHaveBeenCalledWith(CareerObjectiveListPage, { matricule: pncUserMock.matricule });
            });
        });
    });



});
