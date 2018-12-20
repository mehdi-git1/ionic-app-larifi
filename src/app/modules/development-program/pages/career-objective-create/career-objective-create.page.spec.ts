import { IonicModule, NavController, NavParams, AlertController } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';

import { AppConstant } from '../../../../app.constant';
import { CareerObjectiveCreatePage } from './career-objective-create.page';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { NavMock } from '../../../../../test-config/mocks-ionic';
import { OnlineCareerObjectiveService } from '../../../../core/services/career-objective/online-career-objective';
import { OfflineCareerObjectiveService } from '../../../../core/services/career-objective/offline-career-objective.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { OfflinePncService } from '../../../../core/services/pnc/offline-pnc.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { CareerObjectiveStatusService } from '../../../../core/services/career-objective-status/career-objective-status.service';
import { WaypointService } from '../../../../core/services/waypoint/waypoint.service';
import { CareerObjectiveTransformerService } from '../../../../core/services/career-objective/career-objective-transformer.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { CareerObjectiveService } from '../../../../core/services/career-objective/career-objective.service';
import { SynchronizationService } from '../../../../core/services/synchronization/synchronization.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';


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
                CareerObjectiveService,
                { provide: OnlineCareerObjectiveService },
                { provide: OfflineCareerObjectiveService },
                { provide: ConnectivityService },
                { provide: SessionService },
                DateTransform,
                DatePipe,
                { provide: CareerObjectiveTransformerService },
                { provide: CareerObjectiveStatusService },
                { provide: SecurityService },
                { provide: OfflinePncService },
                { provide: WaypointService },
                { provide: ToastService },
                { provide: DeviceService },
                { provide: PncService },
                { provide: SynchronizationService, useValue: synchronizationProviderMock },
                { provide: TranslateService, useValue: translateServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(CareerObjectiveCreatePage);
        comp = fixture.componentInstance;
        comp.careerObjective = new CareerObjectiveModel();
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
