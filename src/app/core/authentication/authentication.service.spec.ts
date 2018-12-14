
import { tick, fakeAsync } from '@angular/core/testing';
import { Events } from 'ionic-angular';

import { AuthenticationStatusEnum } from './../enums/authentication-status.enum';
import { AuthenticationService } from './authentication.service';
import { AuthenticatedUserModel } from '../models/authenticated-user.model';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);

const offlineSecurityServiceMock = jasmine.createSpyObj('offlineSecurityServiceMock', ['getAuthenticatedUser']);
const authenticatedUser = new AuthenticatedUserModel();
authenticatedUser.firstName = 'firstName';
offlineSecurityServiceMock.getAuthenticatedUser.and.returnValue(
    Promise.resolve(authenticatedUser)
);

const securityServiceMock = jasmine.createSpyObj('securityServiceMock', ['getAuthenticatedUser', 'isAdmin']);
const appInitServiceMock = jasmine.createSpyObj('appInitServiceMock', ['initParameters']);
const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['isOfflineModeAvailable', 'isBrowser']);
const synchronizationServiceMock = jasmine.createSpyObj('synchronizationServiceMock', ['']);
const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['initOfflineMap']);
storageServiceMock.initOfflineMap.and.returnValue(Promise.resolve(true));
const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['setConnected']);
const secMobilServiceMock = jasmine.createSpyObj('secMobilServiceMock', ['authenticate']);

describe('AuthenticationService', () => {

    let authenticationService: AuthenticationService;

    beforeEach(() => {
        authenticationService = new AuthenticationService(
            sessionServiceMock,
            offlineSecurityServiceMock,
            securityServiceMock,
            appInitServiceMock,
            deviceServiceMock,
            storageServiceMock,
            connectivityServiceMock,
            synchronizationServiceMock,
            secMobilServiceMock,
            new Events());
        sessionServiceMock.authenticatedUser = authenticatedUser;
    });

    describe('initFonctionnalApp', () => {
        it(`doit retourner un message d'erreur si l'utilisateur n'est pas connecté`, fakeAsync(() => {
            spyOn(authenticationService, 'isAuthenticated').and.returnValue(Promise.resolve(false));
            let retour;
            authenticationService.initFonctionnalApp().then(
                data => retour = data
            );
            tick();
            expect(retour).toEqual(AuthenticationStatusEnum.AUTHENTICATION_KO);
        }));

        it(`doit appeler la fonction manageUserInformationsInApp si l'utilisateur est connecté`, fakeAsync(() => {
            spyOn(authenticationService, 'isAuthenticated').and.returnValue(Promise.resolve(true));
            const manageSpy = spyOn(authenticationService, 'manageUserInformationsInApp');
            authenticationService.initFonctionnalApp().then(data =>
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
            spyOn(authenticationService, 'isInImpersonateMode').and.returnValue(true);
        });

        describe(`Si la fonction putAuthenticatedUserInSession a réussi`, () => {

            describe(`gestion de l'initialisation des paramétres utilisateurs`, () => {
                const authenticatedUserTest: AuthenticatedUserModel = new AuthenticatedUserModel();

                beforeEach(() => {
                    spyOn(authenticationService, 'initUserData').and.returnValue(true);
                    authenticationService.isInImpersonateMode = jasmine.createSpy().and.returnValue(false);
                });

                it(`doit initialiser les paramétres pnc si l'utilisateur est un PNC`, fakeAsync(() => {
                    authenticatedUserTest.isPnc = true;
                    sessionServiceMock.getActiveUser.and.returnValue(authenticatedUserTest);
                    authenticationService.managePutauthenticationInSession().then(
                        data => expect(authenticationService.initUserData).toHaveBeenCalled()
                    );
                }));

                it(`ne doit pas initialiser les paramétres pnc si l'utilisateur n'est pas un PNC`, fakeAsync(() => {
                    authenticatedUserTest.isPnc = true;
                    sessionServiceMock.getActiveUser.and.returnValue(authenticatedUserTest);
                    authenticationService.managePutauthenticationInSession().then(
                        data => expect(authenticationService.initUserData).not.toHaveBeenCalled()
                    );
                }));
            });


            describe(`Mode offline desactivé`, () => {

                beforeEach(() => {
                    deviceServiceMock.isOfflineModeAvailable.and.returnValue(false);
                });

                it('doit renvoyer le type IMPERSONATE_MODE si on doit être en mode impersonifie', fakeAsync(() => {
                    authenticationService.isInImpersonateMode = jasmine.createSpy().and.returnValue(true);
                    authenticationService.managePutauthenticationInSession().then(
                        data => expect(data).toBe(AuthenticationStatusEnum.IMPERSONATE_MODE)
                    );
                }));

                it('doit renvoyer le type AUTHENTICATION_OK si on ne doit pas être en mode impersonifie', fakeAsync(() => {
                    authenticationService.isInImpersonateMode = jasmine.createSpy().and.returnValue(false);
                    authenticationService.managePutauthenticationInSession().then(
                        data => expect(data).toBe(AuthenticationStatusEnum.AUTHENTICATION_OK)
                    );
                }));
            });

            describe(`Mode offline activé`, () => {

                beforeEach(() => {
                    deviceServiceMock.isOfflineModeAvailable.and.returnValue(true);
                    authenticationService.isInImpersonateMode = jasmine.createSpy().and.returnValue(false);
                });

                it(`doit appeler la fonction d'initialisation du cache offlineManagement`, () => {
                    spyOn(authenticationService, 'offlineManagement').and.returnValue(Promise.resolve(false));
                    authenticationService.managePutauthenticationInSession().then(
                        data => expect(authenticationService.offlineManagement).toHaveBeenCalled()
                    );
                });

                it('doit renvoyer le type APPLI_UNAVAILABLE si la gestion du offline renvoie false sur navigateur', fakeAsync(() => {
                    spyOn(authenticationService, 'offlineManagement').and.returnValue(Promise.resolve(false));
                    deviceServiceMock.isBrowser.and.returnValue(true);
                    authenticationService.managePutauthenticationInSession().then(
                        data => expect(data).toBe(AuthenticationStatusEnum.APPLI_UNAVAILABLE)
                    );
                }));

                it(`doit renvoyer le type AUTHENTICATION_OK si la gestion du offline renvoie false sur l'app`, fakeAsync(() => {
                    spyOn(authenticationService, 'offlineManagement').and.returnValue(Promise.resolve(false));
                    deviceServiceMock.isBrowser.and.returnValue(false);
                    authenticationService.managePutauthenticationInSession().then(
                        data => expect(data).toBe(AuthenticationStatusEnum.AUTHENTICATION_OK)
                    );
                }));

                it(`doit renvoyer le type INIT_KO si la gestion du offline plante`, fakeAsync(() => {
                    spyOn(authenticationService, 'offlineManagement').and.returnValue(Promise.reject(false));
                    authenticationService.managePutauthenticationInSession().then(
                        data => expect(data).toBe(AuthenticationStatusEnum.INIT_KO)
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
            expect(authenticationService.isInImpersonateMode(authenticatedUserModelTmp)).toBe(true);
        });

        it(`doit renvoyer false si ! (l'utilisateur est admin, non PNC ou non impersonifié)`, () => {
            const authenticatedUserModelTmp = new AuthenticatedUserModel();

            securityServiceMock.isAdmin.and.returnValue(false);
            authenticatedUserModelTmp.isPnc = false;
            delete (sessionServiceMock.impersonatedUser);
            expect(authenticationService.isInImpersonateMode(authenticatedUserModelTmp)).toBe(false);

            securityServiceMock.isAdmin.and.returnValue(true);
            authenticatedUserModelTmp.isPnc = true;
            delete (sessionServiceMock.impersonatedUser);
            expect(authenticationService.isInImpersonateMode(authenticatedUserModelTmp)).toBe(false);

            securityServiceMock.isAdmin.and.returnValue(true);
            authenticatedUserModelTmp.isPnc = false;
            sessionServiceMock.impersonatedUser = new AuthenticatedUserModel();
            expect(authenticationService.isInImpersonateMode(authenticatedUserModelTmp)).toBe(false);
        });
    });


    describe('authenticateUser', () => {
        it(`doit retourner un message d'erreur AUTHENTICATION_KO si les identifiants sont faux`, fakeAsync(() => {
            secMobilServiceMock.authenticate.and.returnValue(Promise.reject(false));
            authenticationService.authenticateUser('login', 'password').then(
                data => expect(data).toEqual(AuthenticationStatusEnum.AUTHENTICATION_KO)
            );
        }));

        it(`doit appeler la fonction manageUserInformationsInApp si les identifiants sont bons`, fakeAsync(() => {
            secMobilServiceMock.authenticate.and.returnValue(Promise.resolve(true));
            const manageSpy = spyOn(authenticationService, 'manageUserInformationsInApp');
            authenticationService.authenticateUser('login', 'password').then(
                data => expect(manageSpy).toHaveBeenCalled()
            );
        }));
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

    describe('initUserData', () => {

        it(`doit vérifier que l'initialisation des paramétres se lance bien`, () => {
            authenticationService.initUserData();
            expect(appInitServiceMock.initParameters).toHaveBeenCalled();
        });

    });

});
