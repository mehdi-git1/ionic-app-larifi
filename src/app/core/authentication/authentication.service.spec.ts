import { AuthenticationService } from './authentication.service';
import { tick, fakeAsync } from '@angular/core/testing';
import { AuthenticatedUserModel } from '../models/authenticated-user.model';
import { Events } from 'ionic-angular';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['']);

const offlineSecurityServiceMock = jasmine.createSpyObj('offlineSecurityServiceMock', ['getAuthenticatedUser']);
const authenticatedUser = new AuthenticatedUserModel();
authenticatedUser.firstName = 'firstName';
offlineSecurityServiceMock.getAuthenticatedUser.and.returnValue(
    Promise.resolve(authenticatedUser)
);

const securityServiceMock = jasmine.createSpyObj('securityServiceMock', ['getAuthenticatedUser']);
const appInitServiceMock = jasmine.createSpyObj('appInitServiceMock', ['']);
const deviceServiceMock = jasmine.createSpyObj('deviceServiceMock', ['']);
const synchronizationServiceMock = jasmine.createSpyObj('synchronizationServiceMock', ['']);

describe('AuthenticationService', () => {

    let authenticationService: AuthenticationService;

    beforeEach(() => {
        authenticationService = new AuthenticationService(
            sessionServiceMock,
            offlineSecurityServiceMock,
            securityServiceMock,
            appInitServiceMock,
            deviceServiceMock,
            synchronizationServiceMock,
            new Events());
        sessionServiceMock.authenticatedUser = authenticatedUser;
    });

    describe('getAuthenticatedUser', () => {

        it(`doit mettre l'utilisateur connecté (recupére du storage) en session`, fakeAsync(() => {
            authenticationService.getAuthenticatedUserFromCache();
            tick();
            expect(sessionServiceMock.authenticatedUser).toEqual(authenticatedUser);
        }));

    });

    describe('putAuthenticatedUserInSession', () => {

        it(`doit retourner false si il n'y a d'utilisateur en session`, fakeAsync(() => {
            securityServiceMock.getAuthenticatedUser.and.returnValue(
                Promise.reject()
            );
            let putReturn;
            authenticationService.putAuthenticatedUserInSession().then(
                data => putReturn = data
            );
            tick();
            expect(putReturn).toEqual(false);
        }));

    });

    describe('initUserData', () => {
        it(`doit vérifier que l'initialisation des paramétres se lance bien`, () => {

        });
    });

});
