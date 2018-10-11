import { BaseProvider } from './base.provider';

const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['isConnected']);
const onlineServiceMock = jasmine.createSpyObj('onlineServiceMock', ['']);
const offlineServiceMock = jasmine.createSpyObj('offlineServiceMock', ['']);


describe('Base Provider', () => {
    let myClass;

    beforeEach(() => {
        class MyClass extends BaseProvider { }
        myClass = new MyClass(connectivityServiceMock, onlineServiceMock, offlineServiceMock);
    });

    describe('Test Online/ Offline return', () => {
        it('should return onlineProvider when the connection is "on"', () => {
            connectivityServiceMock.isConnected.and.returnValue(true);
            expect(myClass.provider).toBe(onlineServiceMock);
        });

        it('should return onlineProvider when the connection is "off"', () => {
            connectivityServiceMock.isConnected.and.returnValue(false);
            expect(myClass.provider).toBe(offlineServiceMock);
        });
    });

});
