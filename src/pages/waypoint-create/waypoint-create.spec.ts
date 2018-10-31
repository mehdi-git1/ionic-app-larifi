import { IonicModule, NavController, NavParams, AlertController } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../app/app.constant';
import { NavMock } from '../../test-config/mocks-ionic';
import { OfflineCareerObjectiveProvider } from '../../providers/career-objective/offline-career-objective';
import { DateTransformService } from '../../services/date.transform.service';
import { ToastProvider } from '../../providers/toast/toast';
import { SecurityProvider } from './../../providers/security/security';
import { CareerObjectiveStatusProvider } from './../../providers/career-objective-status/career-objective-status';
import { WaypointProvider } from './../../providers/waypoint/waypoint';
import { CareerObjectiveTransformerProvider } from './../../providers/career-objective/career-objective-transformer';
import { ConnectivityService } from './../../services/connectivity/connectivity.service';
import { WaypointCreatePage } from './waypoint-create';
import { OfflineWaypointProvider } from '../../providers/waypoint/offline-waypoint';
import { WaypointStatusProvider } from '../../providers/waypoint-status/waypoint-status';
import { Waypoint } from '../../models/waypoint';
import { SessionService } from './../../services/session.service';
import { DeviceService } from './../../services/device.service';


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
                WaypointStatusProvider,
                { provide: OfflineCareerObjectiveProvider },
                { provide: ConnectivityService },
                DateTransformService,
                DatePipe,
                { provide: CareerObjectiveTransformerProvider },
                { provide: CareerObjectiveStatusProvider },
                { provide: SecurityProvider },
                { provide: OfflineWaypointProvider },
                { provide: WaypointProvider },
                { provide: ToastProvider },
                { provide: DeviceService },
                { provide: SessionService },
                { provide: TranslateService, useValue: translateServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(WaypointCreatePage);
        comp = fixture.componentInstance;
        comp.waypoint = new Waypoint();
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
