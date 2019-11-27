import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppConstant } from '../../../../app.constant';
import { WaypointModel } from '../../../../core/models/waypoint.model';
import {
    CareerObjectiveStatusService
} from '../../../../core/services/career-objective-status/career-objective-status.service';
import {
    CareerObjectiveTransformerService
} from '../../../../core/services/career-objective/career-objective-transformer.service';
import {
    OfflineCareerObjectiveService
} from '../../../../core/services/career-objective/offline-career-objective.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import {
    WaypointStatusService
} from '../../../../core/services/waypoint-status/waypoint-status.service';
import {
    OfflineWaypointService
} from '../../../../core/services/waypoint/offline-waypoint.service';
import { WaypointService } from '../../../../core/services/waypoint/waypoint.service';
import { IsMyPage } from '../../../../shared/pipes/is_my_page/is_my_page.pipe';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { WaypointCreatePage } from './waypoint-create.page';

const translateServiceMock = jasmine.createSpyObj('translateServiceMock', ['instant']);

describe('WaypointCreatePage', () => {
    let fixture: ComponentFixture<WaypointCreatePage>;
    let comp: WaypointCreatePage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                WaypointCreatePage,
                IsMyPage],
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
                AlertController,
                FormBuilder,
                WaypointStatusService,
                { provide: OfflineCareerObjectiveService },
                { provide: ConnectivityService },
                DateTransform,
                DatePipe,
                { provide: CareerObjectiveTransformerService },
                { provide: CareerObjectiveStatusService },
                { provide: SecurityService },
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
