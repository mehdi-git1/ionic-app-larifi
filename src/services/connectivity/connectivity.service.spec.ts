import { Config } from './../../configuration/environment-variables/dev';
import { ConnectivityService } from './connectivity.service';
import { fakeAsync, flushMicrotasks, tick, flush } from '@angular/core/testing';

const restServiceMock = jasmine.createSpyObj('restServiceMock', ['get']);

describe('Connectivity Service', () => {

    let connectivityService: ConnectivityService;

    beforeEach(() => {
        connectivityService = new ConnectivityService(restServiceMock, new Config());
    });

    describe('setConnected function', () => {
        it('should verify if the unconnected works', () => {
            connectivityService.setConnected(false);
            expect(connectivityService.isConnected()).toBe(false);
        });

        it('should verify if the connected works', () => {
            connectivityService.setConnected(true);
            expect(connectivityService.isConnected()).toBe(true);
        });
    });

    describe('loopPingAPI function', () => {
        beforeEach(() => {
            spyOn(connectivityService, 'stopPingAPI').and.callThrough();
            spyOn(connectivityService, 'setConnected').and.callThrough();
        });
        describe('stop if the connection is OK', () => {
            beforeEach(() => {
                restServiceMock.get.and.returnValue(Promise.resolve());
            });
            it('should call the stopPingApi function', fakeAsync(() => {
                connectivityService.loopPingAPI();
                flush();
                expect(connectivityService.stopPingAPI).toHaveBeenCalled();
            }));
            it('should mark as connected', fakeAsync(() => {
                connectivityService.loopPingAPI();
                flush();
                expect(connectivityService.setConnected).toHaveBeenCalledWith(true);
            }));
        });
        xdescribe('should continu if the connection is KO', () => {
            /* beforeEach(() => {
                 restServiceMock.get.and.returnValue(Promise.reject());
             }); */
            it('should not call the stopPingApi function', fakeAsync(() => {
                connectivityService.loopPingAPI();
                flushMicrotasks();
                expect(connectivityService.stopPingAPI).not.toHaveBeenCalled();
            }));
            it('should mark as unconnected', fakeAsync(() => {
                connectivityService.loopPingAPI();
                flushMicrotasks();
                expect(connectivityService.setConnected).toHaveBeenCalledWith(false);
            }));
        });
    });

});
