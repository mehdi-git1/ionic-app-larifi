import { IonicModule, NavController, NavParams, AlertController } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';

import { AppConstant } from '../../app/app.constant';
import { CareerObjectiveCreatePage } from './career-objective-create';
import { CareerObjective } from '../../models/careerObjective';
import { NavMock } from '../../test-config/mocks-ionic';
import { OnlineCareerObjectiveProvider } from '../../providers/career-objective/online-career-objective';
import { OfflineCareerObjectiveProvider } from '../../providers/career-objective/offline-career-objective';
import { SessionService } from '../../services/session.service';
import { DateTransformService } from '../../services/date.transform.service';
import { ToastProvider } from '../../providers/toast/toast';
import { OfflinePncProvider } from './../../providers/pnc/offline-pnc';
import { SecurityProvider } from './../../providers/security/security';
import { CareerObjectiveStatusProvider } from './../../providers/career-objective-status/career-objective-status';
import { WaypointProvider } from './../../providers/waypoint/waypoint';
import { CareerObjectiveTransformerProvider } from './../../providers/career-objective/career-objective-transformer';
import { ConnectivityService } from './../../services/connectivity/connectivity.service';
import { CareerObjectiveProvider } from './../../providers/career-objective/career-objective';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { DeviceService } from './../../services/device.service';


const translateServiceMock = jasmine.createSpyObj('translateServiceMock', ['instant']);
const synchronizationProviderMock = jasmine.createSpyObj('SynchronizationProviderMock', ['']);
synchronizationProviderMock.synchroStatusChange = of({});

describe('CareerObjectiveCreatePage', () => {
    let fixture: ComponentFixture<CareerObjectiveCreatePage>;
    let comp: CareerObjectiveCreatePage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CareerObjectiveCreatePage],
            imports: [
                IonicModule.forRoot(CareerObjectiveCreatePage),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
                        deps: [HttpClient]
                    }
                })
            ],
            providers: [
                HttpClient,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavMock },
                AlertController,
                FormBuilder,
                CareerObjectiveProvider,
                { provide: OnlineCareerObjectiveProvider },
                { provide: OfflineCareerObjectiveProvider },
                { provide: ConnectivityService },
                { provide: SessionService },
                DateTransformService,
                DatePipe,
                { provide: CareerObjectiveTransformerProvider },
                { provide: CareerObjectiveStatusProvider },
                { provide: SecurityProvider },
                { provide: OfflinePncProvider },
                { provide: WaypointProvider },
                { provide: ToastProvider },
                { provide: DeviceService },
                { provide: SynchronizationProvider, useValue: synchronizationProviderMock },
                { provide: TranslateService, useValue: translateServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(CareerObjectiveCreatePage);
        comp = fixture.componentInstance;
        comp.careerObjective = new CareerObjective();
    });


    describe('prepareCareerObjectiveBeforeSubmit', () => {
        it('doit supprimer la propriété encounterDate si elle est nulle', () => {
            expect(comp).toBeDefined();
            comp.careerObjective.encounterDate = '';
            comp.careerObjective = comp.prepareCareerObjectiveBeforeSubmit(comp.careerObjective);
            expect(comp.careerObjective.encounterDate).not.toBeDefined();
        });

        it('doit supprimer la propriété nextEncounterDate si elle est nulle', () => {
            comp.careerObjective.nextEncounterDate = '';
            comp.careerObjective = comp.prepareCareerObjectiveBeforeSubmit(comp.careerObjective);
            expect(comp.careerObjective.nextEncounterDate).not.toBeDefined();
        });

        describe('Mise des dates au format ISO 8601 si la propriété existe ou != ""', () => {

            let testDate;
            let ISODate;

            beforeEach(() => {
                testDate = new Date().toISOString();
                // Création du service DatePipe pour utilisation
                const datePipe = TestBed.get(DatePipe);
                // En considérant que la date doit être formaté au format ISO 8601
                ISODate = datePipe.transform(testDate, AppConstant.iso8601DateTimeFormat);
            });

            it('doit insérer la propriété encounterDate', () => {
                comp.careerObjective.encounterDate = testDate;
                comp.careerObjective = comp.prepareCareerObjectiveBeforeSubmit(comp.careerObjective);
                expect(comp.careerObjective.encounterDate).toEqual(ISODate);
            });

            it('doit insérer la propriété nextEncounterDate', () => {
                comp.careerObjective.nextEncounterDate = testDate;
                comp.careerObjective = comp.prepareCareerObjectiveBeforeSubmit(comp.careerObjective);
                expect(comp.careerObjective.nextEncounterDate).toEqual(ISODate);
            });
        });

    });
});
