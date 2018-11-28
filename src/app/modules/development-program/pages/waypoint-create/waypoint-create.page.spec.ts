import { IonicModule, NavController, NavParams, AlertController } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import { NavMock } from '../../../../../test-config/mocks-ionic';
import { OfflineCareerObjectiveService } from '../../../../core/services/career-objective/offline-career-objective.service';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { SecurityServer } from '../../../../core/services/security/security.server';
import { CareerObjectiveStatusService } from '../../../../core/services/career-objective-status/career-objective-status.service';
import { WaypointService } from '../../../../core/services/waypoint/waypoint.service';
import { CareerObjectiveTransformerService } from '../../../../core/services/career-objective/career-objective-transformer.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { WaypointCreatePage } from './waypoint-create.page';
import { OfflineWaypointService } from '../../../../core/services/waypoint/offline-waypoint.service';
import { WaypointStatusService } from '../../../../core/services/waypoint-status/waypoint-status.service';
import { WaypointModel } from '../../../../core/models/waypoint.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';


const translateServiceMock = jasmine.createSpyObj('translateServiceMock', ['instant']);

describe('WaypointCreatePage', () => {
    let fixture: ComponentFixture<WaypointCreatePage>;
    let comp: WaypointCreatePage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WaypointCreatePage],
            imports: [
                IonicModule.forRoot(WaypointCreatePage),
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
                WaypointStatusService,
                { provide: OfflineCareerObjectiveService },
                { provide: ConnectivityService },
                DateTransform,
                DatePipe,
                { provide: CareerObjectiveTransformerService },
                { provide: CareerObjectiveStatusService },
                { provide: SecurityServer },
                { provide: OfflineWaypointService },
                { provide: WaypointService },
                { provide: ToastService },
                { provide: DeviceService },
                { provide: SessionService },
                { provide: PncService },
                { provide: TranslateService, useValue: translateServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(WaypointCreatePage);
        comp = fixture.componentInstance;
        comp.waypoint = new WaypointModel();
    });


    describe('test de la fonction prepareWaypointBeforeSubmit', () => {
        it('doit supprimer la propriété encounterDate si elle est nulle', () => {
            expect(comp).toBeDefined();
            comp.waypoint.encounterDate = '';
            comp.waypoint = comp.prepareWaypointBeforeSubmit(comp.waypoint);
            expect(comp.waypoint.encounterDate).not.toBeDefined();
        });

        it('doit insérer au format date ISO 8601 la propriété encounterDate si elle n\'est pas nulle', () => {
            const testDate = new Date().toISOString();
            // Création du service DatePipe pour utilisation
            const datePipe = TestBed.get(DatePipe);
            // En considérant que la date doit être formaté au format ISO 8601
            const ISODate = datePipe.transform(testDate, AppConstant.iso8601DateTimeFormat);
            comp.waypoint.encounterDate = testDate;
            comp.waypoint = comp.prepareWaypointBeforeSubmit(comp.waypoint);
            expect(comp.waypoint.encounterDate).toEqual(ISODate);
        });
    });
});
