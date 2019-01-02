import { AuthenticatedUserModel } from './../../../core/models/authenticated-user.model';
import { IsMyPage } from './is_my_page.pipe';
import { PncModel } from '../../../core/models/pnc.model';


const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['getActiveUser', 'isActiveUser']);
sessionServiceMock.getActiveUser.and.returnValue(Promise.resolve(new AuthenticatedUserModel()));


describe('IsMyPage', () => {
    let isMyPage: IsMyPage;

    beforeEach(() => {
        isMyPage = new IsMyPage(sessionServiceMock);
    });

    describe('transform', () => {
        it(`doit retourner la même valeur si on n'est pas sur l'une de nos pages`, () => {
            sessionServiceMock.isActiveUser.and.returnValue(false);
            expect(isMyPage.transform('TEST_VALUE.VALUE', new PncModel())).toEqual('TEST_VALUE.VALUE');
        });

        it(`doit retourner la même valeur avec MY_ si on est sur l'une de nos pages`, () => {
            sessionServiceMock.isActiveUser.and.returnValue(true);
            expect(isMyPage.transform('TEST_VALUE.VALUE', new PncModel())).toEqual('TEST_VALUE.MY_VALUE');
        });
    });

    describe('addMyToTranslate', () => {
        it(`doit retourner TEST_VALUE.MY_VALUE quand on entre TEST_VALUE.VALUE en paramétre`, () => {
            expect(isMyPage.addMyToTranslate('TEST_VALUE.VALUE')).toBe('TEST_VALUE.MY_VALUE');
        });
    });

});
