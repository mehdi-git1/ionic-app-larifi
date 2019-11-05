import { of } from 'rxjs/observable/of';

import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import {
    CareerObjectiveService
} from '../../../../core/services/career-objective/career-objective.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import {
    FormsEObservationService
} from '../../../../core/services/forms/forms-e-observation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import {
    ProfessionalInterviewService
} from '../../../../core/services/professional-interview/professional-interview.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../../core/services/synchronization/synchronization.service';
import {
    HasPermissionDirective
} from '../../../../shared/directives/has-permission/has-permission.directive';
import { IsMyPage } from '../../../../shared/pipes/is_my_page/is_my_page.pipe';
import { CareerObjectiveListPage } from './career-objective-list.page';

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
                IonicModule,
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
                Router,
                ActivatedRoute,
                { provide: CareerObjectiveService },
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: FormsEObservationService },
                { provide: ProfessionalInterviewService },
                { provide: EObservationService, useValue: eObservationServiceMock },
                { provide: SynchronizationService, useValue: synchronizationProviderMock },
                { provide: DeviceService },
                { provide: PncService },
                { provide: SecurityService }
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

