import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import {
    EObservationItemModel
} from '../../../../core/models/eobservation/eobservation-item.model';
import {
    ReferentialItemLevelModel
} from '../../../../core/models/eobservation/eobservation-referential-item-level.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { EObservationComponent } from './e-observation.component';

const EObservationServiceMock = jasmine.createSpyObj('EObservationServiceMock', ['getEObservations', 'getDetailOptionType']);
const TranslateLoaderMock = jasmine.createSpyObj('TranslateLoaderMock', ['instant']);
const routerMock = jasmine.createSpyObj('routerMock', ['navigate']);

describe('EObservationComponent', () => {
    let fixture: ComponentFixture<EObservationComponent>;
    let eObservationComponent: EObservationComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EObservationComponent],
            imports: [
                IonicModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: Router, useValue: routerMock },
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
