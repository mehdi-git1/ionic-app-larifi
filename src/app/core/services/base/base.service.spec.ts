import { BaseService } from './base.service';

const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['isConnected']);
const onlineServiceMock = jasmine.createSpyObj('onlineServiceMock', ['']);
const offlineServiceMock = jasmine.createSpyObj('offlineServiceMock', ['']);


describe('Base Provider', () => {
    let baseService;

    beforeEach(() => {
        class MyClass extends BaseService { }
        baseService = new MyClass(connectivityServiceMock, onlineServiceMock, offlineServiceMock);
    });

    describe('Test Online/ Offline', () => {
        it('doit retourner le onlineProvider quand la connection est OK', () => {
            connectivityServiceMock.isConnected.and.returnValue(true);
            expect(baseService.provider).toBe(onlineServiceMock);
        });

        it('doit retourner le offlineProvider quand la connection est KO', () => {
            connectivityServiceMock.isConnected.and.returnValue(false);
            expect(baseService.provider).toBe(offlineServiceMock);
        });
    });

});
