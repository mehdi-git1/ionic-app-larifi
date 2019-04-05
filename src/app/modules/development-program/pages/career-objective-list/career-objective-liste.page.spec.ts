import { AppConstant } from './../../../../app.constant';
import { OfflineCareerObjectiveService } from './../../../../core/services/career-objective/offline-career-objective.service';
import { OnlineCareerObjectiveService } from './../../../../core/services/career-objective/online-career-objective';
import { HasPermissionDirective } from './../../../../shared/directives/has-permission/has-permission.directive';
import { IsMyPage } from './../../../../shared/pipes/is_my_page/is_my_page.pipe';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { EObservationModel } from './../../../../core/models/eobservation/eobservation.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { EObservationService } from './../../../../core/services/eobservation/eobservation.service';
import { SynchronizationService } from './../../../../core/services/synchronization/synchronization.service';
import { SessionService } from './../../../../core/services/session/session.service';
import { DeviceService } from './../../../../core/services/device/device.service';
import { FormsEObservationService } from './../../../../core/services/forms/forms-e-observation.service';
import { CareerObjectiveService } from './../../../../core/services/career-objective/career-objective.service';
import { NavMock } from './../../../../../test-config/mocks-ionic';
import { HttpClient } from '@angular/common/http';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { CareerObjectiveListPage } from './career-objective-list.page';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const synchronizationProviderMock = jasmine.createSpyObj('SynchronizationProviderMock', ['']);
synchronizationProviderMock.synchroStatusChange = of({});
const sessionServiceMock = jasmine.createSpyObj('SessionServiceMock', ['']);
sessionServiceMock.appContext = {};
sessionServiceMock.appContext.lastConsultedRotation = {};
const eObservationServiceMock = jasmine.createSpyObj('eObservationServiceMock', ['getEObservations']);

describe('CareerObjectiveListPage', () => {
    let fixture: ComponentFixture<CareerObjectiveListPage>;
    let comp: CareerObjectiveListPage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                CareerObjectiveListPage,
                IsMyPage,
                HasPermissionDirective
            ],
            imports: [
                IonicModule.forRoot(CareerObjectiveListPage),
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
                { provide: CareerObjectiveService },
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: FormsEObservationService },
                { provide: EObservationService, useValue: eObservationServiceMock },
                { provide: SynchronizationService, useValue: synchronizationProviderMock },
                { provide: DeviceService },
                { provide: PncService },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(CareerObjectiveListPage);
        comp = fixture.componentInstance;
    });

    describe('getEObservationsList', () => {
        it('doit trier la liste des eObservations par date de rotation', fakeAsync(() => {
            expect(comp).toBeDefined();
            const eObservation1 = new EObservationModel();
            eObservation1.rotationDate = new Date('01/01/2019');
            const eObservation2 = new EObservationModel();
            eObservation2.rotationDate = new Date('01/10/2019');
            const eObservation3 = new EObservationModel();
            eObservation3.rotationDate = new Date('01/01/2018');
            const eObservations = new Array();
            eObservations.push(eObservation1);
            eObservations.push(eObservation2);
            eObservations.push(eObservation3);
            eObservationServiceMock.getEObservations.and.returnValue(Promise.resolve(eObservations));
            comp.getEObservationsList();
            tick();
            expect(comp.eObservations[0].rotationDate).toEqual(new Date('01/10/2019'));
            expect(comp.eObservations[1].rotationDate).toEqual(new Date('01/01/2019'));
            expect(comp.eObservations[2].rotationDate).toEqual(new Date('01/01/2018'));
        }));
    });
});

