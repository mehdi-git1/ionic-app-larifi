
import { fakeAsync, tick } from '@angular/core/testing';

import { AuthenticationStatusEnum } from '../enums/authentication-status.enum';
import { AuthenticatedUserModel } from '../models/authenticated-user.model';
import { AuthenticationService } from './authentication.service';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);

const offlineSecurityServiceMock = jasmine.createSpyObj('offlineSecurityServiceMock', ['getAuthenticatedUser']);
const authenticatedUser = new AuthenticatedUserModel();
authenticatedUser.firstName = 'firstName';
offlineSecurityServiceMock.getAuthenticatedUser.and.returnValue(
    Promise.resolve(authenticatedUser)
);

const securityServiceMock = jasmine.createSpyObj('securityServiceMock', ['getAuthenticatedUser', 'isAdmin']);
const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isOfflineModeAvailable', 'isBrowser']);
const synchronizationServiceMock = jasmine.createSpyObj('synchronizationServiceMock', ['storeEDossierOffline']);
const synchronizationManagementServiceMock = jasmine.createSpyObj('synchronizationManagementServiceMock', ['']);
const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['initOfflineMap']);
storageServiceMock.initOfflineMap.and.returnValue(Promise.resolve(true));
const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['setConnected']);
const secMobilServiceMock = jasmine.createSpyObj('secMobilServiceMock', ['authenticate']);
const ToastServiceMock = jasmine.createSpyObj('ToastServiceMock', ['success', 'warning']);
const TranslateServiceMock = jasmine.createSpyObj('TranslateServiceMock', ['instant']);

describe('AuthenticationService', () => {

    let authenticationService: AuthenticationService;

    beforeEach(() => {
        authenticationService = new AuthenticationService(
            sessionServiceMock,
            offlineSecurityServiceMock,
            securityServiceMock,
            deviceServiceMock,
            storageServiceMock,
            TranslateServiceMock,
            ToastServiceMock,
            connectivityServiceMock,
            synchronizationServiceMock,
            synchronizationManagementServiceMock,
            secMobilServiceMock);
        sessionServiceMock.authenticatedUser = authenticatedUser;
        sessionServiceMock.getActiveUser.and.returnValue(authenticatedUser);
    });

    describe('initFonctionnalApp', () => {
        it(`doit retourner un message d'erreur si l'utilisateur n'est pas connecté`, fakeAsync(() => {
            spyOn(authenticationService, 'isAuthenticated').and.returnValue(Promise.resolve(false));
            let retour;
            authenticationService.initFunctionalApp().then(
                data => retour = data
            );
            tick();
            expect(retour).toEqual(AuthenticationStatusEnum.AUTHENTICATION_KO);
        }));

        it(`doit appeler la fonction manageUserInformationsInApp si l'utilisateur est connecté`, fakeAsync(() => {
            spyOn(authenticationService, 'isAuthenticated').and.returnValue(Promise.resolve(true));
            const manageSpy = spyOn(authenticationService, 'manageUserInformationsInApp');
            authenticationService.initFunctionalApp().then(data =>
                expect(manageSpy).toHaveBeenCalled()
            );
        }));
    });

    describe('manageUserInformationsInApp', () => {

        it(`doit renvoyer un message d'erreur INIT_KO si putAuthenticatedUserInSession echoue`, fakeAsync(() => {
            authenticationService.putAuthenticatedUserInSession = jasmine.createSpy().and.returnValue(Promise.reject(false));
            authenticationService.manageUserInformationsInApp().then(
                data => expect(data).toBe(AuthenticationStatusEnum.INIT_KO)
            );
        }));
    });

    describe('managePutauthenticationInSession', () => {
        beforeEach(() => {
            spyOn(authenticationService, 'userHaveToImpersonate').and.returnValue(true);
        });

        describe(`Si la fonction putAuthenticatedUserInSession a réussi`, () => {

            describe(`Mode offline desactivé`, () => {

                beforeEach(() => {
                    deviceServiceMock.isOfflineModeAvailable.and.returnValue(false);
                });

                it('doit renvoyer le type IMPERSONATE_MODE si on doit être en mode impersonifie', fakeAsync(() => {
                    authenticationService.userHaveToImpersonate = jasmine.createSpy().and.returnValue(true);
                    authenticationService.initializeUser().then(
                        data => expect(data).toBe(AuthenticationStatusEnum.IMPERSONATE_MODE)
                    );
                }));

                it('doit renvoyer le type AUTHENTICATION_OK si on ne doit pas être en mode impersonifie', fakeAsync(() => {
                    authenticationService.userHaveToImpersonate = jasmine.createSpy().and.returnValue(false);
                    authenticationService.initializeUser().then(
                        data => expect(data).toBe(AuthenticationStatusEnum.AUTHENTICATION_OK)
                    );
                }));
            });

            describe(`Mode offline activé`, () => {

                beforeEach(() => {
                    deviceServiceMock.isOfflineModeAvailable.and.returnValue(true);
                    authenticationService.userHaveToImpersonate = jasmine.createSpy().and.returnValue(false);
                });

                it(`doit appeler la fonction d'initialisation du cache offlineManagement`, () => {
                    spyOn(authenticationService, 'offlineManagement').and.returnValue(Promise.resolve(false));
                    authenticationService.initializeUser().then(
                        data => expect(authenticationService.offlineManagement).toHaveBeenCalled()
                    );
                });

                it(`doit afficher un toast avec comme message 'GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE' si la gestion du offline renvoie false sur navigateur`, fakeAsync(() => {
                    spyOn(authenticationService, 'offlineManagement').and.returnValue(Promise.resolve(false));
                    deviceServiceMock.isBrowser.and.returnValue(true);
                    authenticationService.initializeUser().then(
                        data => {
                            expect(TranslateServiceMock.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE');
                            expect(ToastServiceMock.warning).toHaveBeenCalled();
                        }
                    );
                }));

                it(`doit renvoyer le type AUTHENTICATION_OK si la gestion du offline renvoie false sur l'app`, fakeAsync(() => {
                    spyOn(authenticationService, 'offlineManagement').and.returnValue(Promise.resolve(false));
                    deviceServiceMock.isBrowser.and.returnValue(false);
                    authenticationService.initializeUser().then(
                        data => expect(data).toBe(AuthenticationStatusEnum.AUTHENTICATION_OK)
                    );
                }));

                it(`doit renvoyer un toast avec comme message 'GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'  si la gestion du offline plante`, fakeAsync(() => {
                    spyOn(authenticationService, 'offlineManagement').and.returnValue(Promise.reject(false));
                    authenticationService.initializeUser().then(
                        data => {
                            expect(TranslateServiceMock.instant).toHaveBeenCalledWith('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE');
                            expect(ToastServiceMock.warning).toHaveBeenCalled();
                        }
                    );
                }));
            });
        });

    });

    describe('isInImpersonateMode', () => {
        it(`doit renvoyer true si l'utilisateur est admin, non PNC et non impersonifié`, () => {
            securityServiceMock.isAdmin.and.returnValue(true);
            const authenticatedUserModelTmp = new AuthenticatedUserModel();
            authenticatedUserModelTmp.isPnc = false;
            delete (sessionServiceMock.impersonatedUser);
            expect(authenticationService.userHaveToImpersonate(authenticatedUserModelTmp)).toBe(true);
        });

        it(`doit renvoyer false si ! (l'utilisateur est admin, non PNC ou non impersonifié)`, () => {
            const authenticatedUserModelTmp = new AuthenticatedUserModel();

            securityServiceMock.isAdmin.and.returnValue(false);
            authenticatedUserModelTmp.isPnc = false;
            delete (sessionServiceMock.impersonatedUser);
            expect(authenticationService.userHaveToImpersonate(authenticatedUserModelTmp)).toBe(false);

            securityServiceMock.isAdmin.and.returnValue(true);
            authenticatedUserModelTmp.isPnc = true;
            delete (sessionServiceMock.impersonatedUser);
            expect(authenticationService.userHaveToImpersonate(authenticatedUserModelTmp)).toBe(false);

            securityServiceMock.isAdmin.and.returnValue(true);
            authenticatedUserModelTmp.isPnc = false;
            sessionServiceMock.impersonatedUser = new AuthenticatedUserModel();
            expect(authenticationService.userHaveToImpersonate(authenticatedUserModelTmp)).toBe(false);
        });
    });

    describe('getAuthenticatedUserFromCache', () => {

        it(`doit mettre l'utilisateur connecté (recupére du storage) en session`, fakeAsync(() => {
            authenticationService.getAuthenticatedUserFromCache();
            tick();
            expect(sessionServiceMock.authenticatedUser).toEqual(authenticatedUser);
        }));

    });

    describe('putAuthenticatedUserInSession', () => {

        it(`doit retourner false si il n'y a pas d'utilisateur en session`, fakeAsync(() => {
            securityServiceMock.getAuthenticatedUser.and.returnValue(
                Promise.reject('false')
            );
            deviceServiceMock.isOfflineModeAvailable.and.returnValue(false);
            authenticationService.putAuthenticatedUserInSession().then(
                data => expect(data).toEqual(false)
            );
        }));

    });

});

