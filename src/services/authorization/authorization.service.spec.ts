import { AuthorizationService } from './authorization.service';
import { AuthenticatedUser } from '../../models/authenticatedUser';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser']);

describe('AuthorizationService', () => {

    let authorizationService: AuthorizationService;

    beforeEach(() => {
        authorizationService = new AuthorizationService(sessionServiceMock);
    });

    it(`doit renvoyer true si le user a le droit de voir l'impersonnification `, () => {
        const authenticatedUser = new AuthenticatedUser();
        authenticatedUser.permissions = new Array();
        authenticatedUser.permissions.push('SHOW_IMPERSONNIFICATION');
        sessionServiceMock.getActiveUser.and.returnValue(authenticatedUser);

        expect(authorizationService.hasPermission('SHOW_IMPERSONNIFICATION')).toBe(true);
    });

    it(`doit renvoyer false si le user n'a pas le droit de voir l'impersonnification `, () => {
        const authenticatedUser = new AuthenticatedUser();
        authenticatedUser.permissions = new Array();
        sessionServiceMock.getActiveUser.and.returnValue(authenticatedUser);

        expect(authorizationService.hasPermission('SHOW_IMPERSONNIFICATION')).toBe(false);
    });

});
