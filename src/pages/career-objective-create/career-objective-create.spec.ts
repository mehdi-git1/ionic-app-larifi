import { SessionService } from '../../services/session.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { IonicModule, Platform, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { NO_ERRORS_SCHEMA, Component, DebugElement, ElementRef, EventEmitter } from '@angular/core';
import { TestBed, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { } from 'jasmine';
import {By} from "@angular/platform-browser";
import {
    NavMock,
    PlatformMock
} from '../../test-config/mocks-ionic';
import { CareerObjectiveCreatePage } from './career-objective-create';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CareerObjectiveProvider } from '../../providers/career-objective/career-objective';
import { WaypointProvider } from '../../providers/waypoint/waypoint';
import { ToastProvider } from '../../providers/toast/toast';
import { CareerObjectiveStatusProvider } from '../../providers/career-objective-status/career-objective-status';
import { SecurityProvider } from '../../providers/security/security';
import { DateTransformService } from '../../services/date.transform.service';
import { ConnectivityService } from '../../services/connectivity.service';
import { OfflinePncProvider } from '../../providers/pnc/offline-pnc';
import { OfflineCareerObjectiveProvider } from '../../providers/career-objective/offline-career-objective';
import { DeviceService } from '../../services/device.service';
import { SynchronizationProvider } from '../../providers/synchronization/synchronization';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CareerObjective } from '../../models/careerObjective';
import { Pnc } from '../../models/pnc';
import { AuthenticatedUser } from '../../models/authenticatedUser';
import { CareerObjectiveStatus } from '../../models/careerObjectiveStatus';

export const MY_MATRICULE: string = '01234';
const securityProviderMock = jasmine.createSpyObj('securityProviderMock', ['isManager']);
const careerObjectiveStatusProviderMock = jasmine.createSpyObj('careerObjectiveStatusProviderMock', ['isTransitionOk']);
const formBuilderMock = jasmine.createSpyObj('formBuilderMock', ['group']);
const translateServiceMock = jasmine.createSpyObj('translateServiceMock', ['instant']);
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

class SynchronizationProviderMock {
    synchroStatusChange = new EventEmitter<boolean>();
}

class SessionServiceMock {
    authenticatedUser: AuthenticatedUser = new AuthenticatedUser();
    constructor() {
        this.authenticatedUser.matricule = MY_MATRICULE;
    }
}
describe('Page: CareerObjectiveCreatePage', () => {

    let fixture: ComponentFixture<CareerObjectiveCreatePage>;
    let component: CareerObjectiveCreatePage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CareerObjectiveCreatePage],
            imports: [
                IonicModule.forRoot(CareerObjectiveCreatePage),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (createTranslateLoader),
                        deps: [HttpClient]
                    }
                })
            ],
            providers: [
                { provide: Platform, useClass: PlatformMock },
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavMock },
                { provide: AlertController},
                { provide: TranslateService, useValue: translateServiceMock},
                { provide: FormBuilder, useValue: formBuilderMock},
                { provide: CareerObjectiveProvider},
                { provide: WaypointProvider},
                { provide: ToastProvider},
                { provide: CareerObjectiveStatusProvider, useValue: careerObjectiveStatusProviderMock},
                { provide: SessionService, useClass: SessionServiceMock},
                { provide: SecurityProvider, useValue: securityProviderMock},
                { provide: LoadingController},
                { provide: DateTransformService},
                { provide: ConnectivityService},
                { provide: OfflinePncProvider},
                { provide: OfflineCareerObjectiveProvider},
                { provide: DeviceService},
                { provide: SynchronizationProvider, useClass: SynchronizationProviderMock}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(CareerObjectiveCreatePage);
        component = fixture.componentInstance;
    });

    function createDraftCareerObjective(matricule: string): CareerObjective {
        const careerObjective = new CareerObjective();
        careerObjective.careerObjectiveStatus = CareerObjectiveStatus.DRAFT;
        careerObjective.creationAuthor = new Pnc();
        careerObjective.creationAuthor.matricule = matricule;
        return careerObjective;
    }

    describe("Check Draft can be deleted", () => {
        it("Draft should be deleted when User is Pnc and is the iniator", () => {
            expect(component).toBeDefined();
            securityProviderMock.isManager.and.returnValue(false);
            component.careerObjective = createDraftCareerObjective(MY_MATRICULE);

            const draftAndCanBeDeleted = component.isDraftAndCanBeDeleted();
            expect(draftAndCanBeDeleted).toBe(true);
        });

        it("Draft shouldn't be deleted when User is Pnc and isn't the iniator", () => {
            expect(component).toBeDefined();        
            securityProviderMock.isManager.and.returnValue(false);
            component.careerObjective = createDraftCareerObjective('OTHER_MATRICULE');

            const draftAndCanBeDeleted = component.isDraftAndCanBeDeleted();
            expect(draftAndCanBeDeleted).toBe(false);
        });

        it("Draft should be deleted when User is Manager and isn't the iniator", () => {
            expect(component).toBeDefined();
            securityProviderMock.isManager.and.returnValue(true);
            component.careerObjective = createDraftCareerObjective('OTHER_MATRICULE');
            const draftAndCanBeDeleted = component.isDraftAndCanBeDeleted();
            expect(draftAndCanBeDeleted).toBe(true);
        });
    });

    describe("Draft can be modified", () => {
        it("Draft should be modified when User is Pnc and is the iniator", () => {
            expect(component).toBeDefined();
            securityProviderMock.isManager.and.returnValue(false);
            careerObjectiveStatusProviderMock.isTransitionOk.and.returnValue(true);
            component.careerObjective = createDraftCareerObjective(MY_MATRICULE);

            const draftAndCanBeModified = component.isDraftAndCanBeModified();
            expect(draftAndCanBeModified).toBe(true);
        });

        it("Priority should not be saved as draft when User is Pnc and is the iniator but priority is not draft", () => {
            expect(component).toBeDefined();
            securityProviderMock.isManager.and.returnValue(false);
            careerObjectiveStatusProviderMock.isTransitionOk.and.returnValue(false);
            component.careerObjective = createDraftCareerObjective(MY_MATRICULE);

            const draftAndCanBeModified = component.isDraftAndCanBeModified();
            expect(draftAndCanBeModified).toBe(false);
        });

        it("Draft shouldn't be modified when User is Pnc and isn't the iniator", () => {
            expect(component).toBeDefined();        
            securityProviderMock.isManager.and.returnValue(false);
            careerObjectiveStatusProviderMock.isTransitionOk.and.returnValue(true);
            component.careerObjective = createDraftCareerObjective('OTHER_MATRICULE');

            const draftAndCanBeModified = component.isDraftAndCanBeModified();
            expect(draftAndCanBeModified).toBe(false);
        });

        it("Draft should be modified when User is Manager and isn't the iniator", () => {
            expect(component).toBeDefined();
            securityProviderMock.isManager.and.returnValue(true);
            careerObjectiveStatusProviderMock.isTransitionOk.and.returnValue(true);
            component.careerObjective = createDraftCareerObjective('OTHER_MATRICULE');

            const draftAndCanBeModified = component.isDraftAndCanBeModified();
            expect(draftAndCanBeModified).toBe(true);
        });
    });
});
