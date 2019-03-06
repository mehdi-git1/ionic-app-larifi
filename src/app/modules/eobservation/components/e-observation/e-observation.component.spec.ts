import { EObservationItemModel } from './../../../../core/models/eobservation/eobservation-item.model';
import { EObservationComponent } from './e-observation.component';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/referential-item-level.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import {
    NavMock,
    PlatformMock,
    TranslateLoaderMock
} from '../../../../../test-config/mocks-ionic';
import { IonicModule, NavController, Platform } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

const EObservationServiceMock = jasmine.createSpyObj('EObservationServiceMock', ['getEObservations', 'getDetailOptionType']);

describe('EObservationComponent', () => {
    let fixture: ComponentFixture<EObservationComponent>;
    let eObservationComponent: EObservationComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EObservationComponent],
            imports: [
                IonicModule.forRoot(EObservationComponent),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: Platform, useClass: PlatformMock },
                { provide: NavController, useClass: NavMock },
                { provide: EObservationService, useValue: EObservationServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EObservationComponent);
        eObservationComponent = fixture.componentInstance;
    });

    describe('isEObservationItemAbnormal', () => {
        it(`doit retourner vrai si le niveau est différent de LEVEL_3, NO, C`, () => {
            const eObservationItem = new EObservationItemModel();
            const refItemLevel = new ReferentialItemLevelModel();
            eObservationItem.refItemLevel = refItemLevel;
            refItemLevel.level = EObservationLevelEnum.LEVEL_1;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeTruthy();
            refItemLevel.level = EObservationLevelEnum.LEVEL_2;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeTruthy();
            refItemLevel.level = EObservationLevelEnum.LEVEL_3;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeFalsy();
            refItemLevel.level = EObservationLevelEnum.LEVEL_4;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeTruthy();
            refItemLevel.level = EObservationLevelEnum.A;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeTruthy();
            refItemLevel.level = EObservationLevelEnum.C;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeFalsy();
            refItemLevel.level = EObservationLevelEnum.NO;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeFalsy();
        });
    });

});
