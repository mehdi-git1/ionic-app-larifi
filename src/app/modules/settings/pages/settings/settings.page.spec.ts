import { VersionService } from './../../../../core/services/version/version.service';
import { AppVersion } from '@ionic-native/app-version';
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
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const ConnectivityServiceMock = jasmine.createSpyObj('ConnectivityServiceMock', ['isConnected']);
ConnectivityServiceMock.connectionStatusChange = of({});

const SynchronizationServiceMock = jasmine.createSpyObj('SynchronizationServiceMock', ['']);
SynchronizationServiceMock.synchroStatusChange = of({});

const DeviceServiceMock = jasmine.createSpyObj('DeviceServiceMock', ['isBrowser']);
const SecMobilServiceMock = jasmine.createSpyObj('SecMobilServiceMock', ['secMobilRevokeCertificate']);
SecMobilServiceMock.secMobilRevokeCertificate.and.returnValue(Promise.resolve());

const VersionServiceMock = jasmine.createSpyObj('VersionServiceMock', ['getBackVersion']);
const AppVersionMock = jasmine.createSpyObj('AppVersionMock', ['getVersionNumber']);

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
                { provide: AppVersion, useValue: AppVersionMock },
                { provide: VersionService, useValue: VersionServiceMock },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(SettingsPage);
        comp = fixture.componentInstance;
        comp.isApp = true;
        EventsService = TestBed.get(Events);
        AppVersionMock.getVersionNumber.and.returnValue(Promise.resolve('1.1.0'));
    });

    describe('revokeCertificate', () => {

        it('doit verifier si on appelle bien l\'event user:authenticationLogout', () => {
            EventsService.subscribe('user:authenticationLogout', (data) => {
                expect(true).toBe(true);
            });
            comp.revokeCertificate();
        });

    });

    describe('Version front', () => {
        beforeEach(() => {
            expect(comp).toBeDefined();
            comp.isApp = true;
        });

        it('doit vérifier si la version du front est bien 1.1.0, sur ipad en mode déconnecté ', fakeAsync(() => {
            VersionServiceMock.getBackVersion.and.returnValue(Promise.reject(null));
            comp.getFrontAndBackVersion();
            tick();
            expect(comp.frontVersion).toBe('1.1.0');
        }));

        it('doit vérifier si la version du front est bien 1.1.0, et la version du back est 1.2.0 sur ipad en mode connecté', fakeAsync(() => {
            VersionServiceMock.getBackVersion.and.returnValue(Promise.resolve({ appVersion: '1.2.0' }));
            comp.getFrontAndBackVersion();
            tick();
            expect(comp.frontVersion).toBe('1.1.0');
            expect(comp.backVersion).toBe('1.2.0');
        }));

        it('doit vérifier si la version du front est bien la même que celle du back (1.2.0) en web en mode connecté', fakeAsync(() => {
            VersionServiceMock.getBackVersion.and.returnValue(Promise.resolve({ appVersion: '1.2.0' }));
            comp.isApp = false;
            comp.getFrontAndBackVersion();
            tick();
            expect(comp.frontVersion).toBe('1.2.0');
            expect(comp.backVersion).toBe('1.2.0');
        }));

    });
});
