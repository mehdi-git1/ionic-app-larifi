import { BaseProvider } from './base.provider';

const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['isConnected']);
const onlineServiceMock = jasmine.createSpyObj('onlineServiceMock', ['']);
const offlineServiceMock = jasmine.createSpyObj('offlineServiceMock', ['']);


describe('Base Provider', () => {
    let baseProvider;

    beforeEach(() => {
        class MyClass extends BaseProvider { }
        baseProvider = new MyClass(connectivityServiceMock, onlineServiceMock, offlineServiceMock);
    });

    describe('Test Online/ Offline', () => {
        it('doit retourner le onlineProvider quand la connection est OK', () => {
            connectivityServiceMock.isConnected.and.returnValue(true);
            expect(baseProvider.provider).toBe(onlineServiceMock);
        });

        it('doit retourner le offlineProvider quand la connection est KO', () => {
            connectivityServiceMock.isConnected.and.returnValue(false);
            expect(baseProvider.provider).toBe(offlineServiceMock);
        });
    });

});
