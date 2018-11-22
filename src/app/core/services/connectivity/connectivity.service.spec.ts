
import { ConnectivityService } from './connectivity.service';
import { fakeAsync, flushMicrotasks, flush } from '@angular/core/testing';
import { UrlConfiguration } from '../../configuration/url.configuration';

const restServiceMock = jasmine.createSpyObj('restServiceMock', ['get']);

describe('Connectivity Service', () => {

    let connectivityService: ConnectivityService;

    beforeEach(() => {
        connectivityService = new ConnectivityService(restServiceMock, new UrlConfiguration());
    });

    describe('test de la fonction setConnected', () => {
        it('doit vérifier que la mise en deconnecté fonctionne', () => {
            connectivityService.setConnected(false);
            expect(connectivityService.isConnected()).toBe(false);
        });

        it('doit vérifier que la mise en connecté fonctionne', () => {
            connectivityService.setConnected(true);
            expect(connectivityService.isConnected()).toBe(true);
        });
    });

    describe('test de la fonction loopPingAPI', () => {
        beforeEach(() => {
            spyOn(connectivityService, 'stopPingAPI').and.callThrough();
            spyOn(connectivityService, 'setConnected').and.callThrough();
        });
        describe('stoppe le ping si la connection est OK', () => {
            beforeEach(() => {
                restServiceMock.get.and.returnValue(Promise.resolve());
            });
            it('doit appeler la fonction stopPingApi', fakeAsync(() => {
                connectivityService.loopPingAPI();
                flush();
                expect(connectivityService.stopPingAPI).toHaveBeenCalled();
            }));
            it('doit marquer la connection à true', fakeAsync(() => {
                connectivityService.loopPingAPI();
                flush();
                expect(connectivityService.setConnected).toHaveBeenCalledWith(true);
            }));
        });
        /* Tests désactivés en attentand de trouver une solution pour
        * tester le loop de façon propre.
        */
        xdescribe('continue le ping si la connexion est KO', () => {
            /* beforeEach(() => {
                 restServiceMock.get.and.returnValue(Promise.reject());
             }); */
            it('ne doit pas appeler la fonction stopPingAPI', fakeAsync(() => {
                connectivityService.loopPingAPI();
                flushMicrotasks();
                expect(connectivityService.stopPingAPI).not.toHaveBeenCalled();
            }));
            it('doit marquer la connection à false', fakeAsync(() => {
                connectivityService.loopPingAPI();
                flushMicrotasks();
                expect(connectivityService.setConnected).toHaveBeenCalledWith(false);
            }));
        });
    });

});
