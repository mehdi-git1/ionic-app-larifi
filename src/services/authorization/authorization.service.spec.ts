import { AuthorizationService } from './authorization.service';
import { AuthenticatedUser } from '../../models/authenticatedUser';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);

describe('Service: AuthenticationService', () => {

    let authorizationService: AuthorizationService;

    beforeEach(() => {
        authorizationService = new AuthorizationService(sessionServiceMock);
    });

    it('User has right to show impersonnification', () => {
        const authenticatedUser = new AuthenticatedUser();
        authenticatedUser.permissions = new Array();
        authenticatedUser.permissions.push('SHOW_IMPERSONNIFICATION');
        sessionServiceMock.getActiveUser.and.returnValue(authenticatedUser);

        expect(authorizationService.hasPermission('SHOW_IMPERSONNIFICATION')).toBe(true);
    });

    it('User has no right to show impersonnification', () => {
        const authenticatedUser = new AuthenticatedUser();
        authenticatedUser.permissions = new Array();
        sessionServiceMock.getActiveUser.and.returnValue(authenticatedUser);

        expect(authorizationService.hasPermission('SHOW_IMPERSONNIFICATION')).toBe(false);
    });

});
