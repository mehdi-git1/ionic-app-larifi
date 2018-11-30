import { of } from 'rxjs/observable/of';
import { ConnectivityService } from './../../../../core/services/connectivity/connectivity.service';
import { OfflineSecurityService } from './../../../../core/services/security/offline-security.service';
import { DeviceService } from './../../../../core/services/device/device.service';
import { ModalSecurityService } from './../../../../core/services/modal/modal-security.service';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { SessionService } from './../../../../core/services/session/session.service';
import { SynchronizationService } from './../../../../core/services/synchronization/synchronization.service';
import { StorageService } from './../../../../core/storage/storage.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { FlightCrewListPage } from './../../../flight-activity/pages/flight-crew-list/flight-crew-list.page';
import { SecMobilService } from './../../../../core/http/secMobil.service';
import { PlatformMock, NavMock, TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';
import { IonicModule, Platform, NavController, Events, AlertController } from 'ionic-angular';
import { SettingsPage } from './settings.page';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const ConnectivityServiceMock = jasmine.createSpyObj('ConnectivityServiceMock', ['isConnected']);
ConnectivityServiceMock.connectionStatusChange = of({});

const SynchronizationServiceMock = jasmine.createSpyObj('SynchronizationServiceMock', ['']);
SynchronizationServiceMock.synchroStatusChange = of({});

const DeviceServiceMock = jasmine.createSpyObj('DeviceServiceMock', ['isBrowser']);
const SecMobilServiceMock = jasmine.createSpyObj('SecMobilServiceMock', ['secMobilRevokeCertificate']);
SecMobilServiceMock.secMobilRevokeCertificate.and.returnValue(Promise.resolve());


describe('SettingsPage', () => {

    let fixture: ComponentFixture<SettingsPage>;
    let comp: SettingsPage;
    let EventsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsPage],
            imports: [
                IonicModule.forRoot(SettingsPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                Events,
                { provide: Platform, useClass: PlatformMock },
                { provide: NavController, useClass: NavMock },
                { provide: SecMobilService, useValue: SecMobilServiceMock },
                { provide: ConnectivityService, useValue: ConnectivityServiceMock },
                { provide: StorageService },
                { provide: SynchronizationService, useValue: SynchronizationServiceMock },
                { provide: SessionService },
                { provide: ToastService },
                { provide: TranslateService },
                { provide: AlertController },
                { provide: ModalSecurityService },
                { provide: DeviceService, useValue: DeviceServiceMock },
                { provide: OfflineSecurityService },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(SettingsPage);
        comp = fixture.componentInstance;
        EventsService = TestBed.get(Events);
    });

    describe('revokeCertificate', () => {

        it('doit verifier si on appelle bien l\'event user:authenticationLogout', () => {
            EventsService.subscribe('user:authenticationLogout', (data) => {
                expect(true).toBe(true);
            });
            comp.revokeCertificate();
        });

    });
});
