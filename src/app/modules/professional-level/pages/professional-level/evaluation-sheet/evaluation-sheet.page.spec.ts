import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavParams } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { PncService } from '../../../../../core/services/pnc/pnc.service';
import {
    EvaluationSheetService
} from '../../../../../core/services/professional-level/evaluation-sheet/evaluation-sheet.service';
import { SessionService } from '../../../../../core/services/session/session.service';
import { IsMyPage } from '../../../../../shared/pipes/is_my_page/is_my_page.pipe';
import {
    ReplaceByPointPipe
} from '../../../../../shared/pipes/replace-by-point/replaceByPoint.pipe';
import { ScorePercentPipe } from '../../../../../shared/pipes/score-percent/score-percent.pipe';
import { EvaluationSheetPage } from './evaluation-sheet.page';

const testEvaluationSheetData = {
    stageCode: 'SMG',
    module: { techId: 12, label: 'Désarmement toboggan', moduleResultStatus: 'FAILED' },

    exercises: [{
        label: 'Placer le sélecteur sur disarmed',
        title: false,
        e1: true,
        e2: true
    },
    {
        label: 'Insérer la goupille de sécurité',
        title: false,
        e1: true,
        e2: false
    }]
};

const EvaluationSheetServiceMock = jasmine.createSpyObj('EvaluationSheetServiceMock', ['getEvaluationSheet']);
EvaluationSheetServiceMock.getEvaluationSheet.and.returnValue(Promise.resolve(testEvaluationSheetData));

const PncServiceMock = jasmine.createSpyObj('SessionServiceMock', ['getPnc']);
PncServiceMock.getPnc.and.returnValue(Promise.resolve('ok'));

const SessionServiceMock = jasmine.createSpyObj('SessionServiceMock', ['isActiveUser']);
const TranslateLoaderMock = jasmine.createSpyObj('TranslateLoaderMock', ['instant']);
const NavMock = jasmine.createSpyObj('NavMock', ['']);
const ActivatedRouteMock = jasmine.createSpyObj('ActivatedRouteMock', ['']);

describe('EvaluationSheetPage', () => {

    let fixture: ComponentFixture<EvaluationSheetPage>;
    let comp: EvaluationSheetPage;
    let failureEl: DebugElement;
    let navParams: NavParams;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EvaluationSheetPage,
                ReplaceByPointPipe,
                ScorePercentPipe,
                IsMyPage
            ],
            imports: [
                IonicModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: NavParams, useValue: NavMock },
                { provide: EvaluationSheetService, useValue: EvaluationSheetServiceMock },
                { provide: SessionService, useValue: SessionServiceMock },
                { provide: PncService, useValue: PncServiceMock },
                { provide: ActivatedRoute, useValue: ActivatedRouteMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(EvaluationSheetPage);
        comp = fixture.componentInstance;
        navParams = TestBed.get(NavParams);
    });

    beforeEach(fakeAsync(() => {
        comp.loadData();
        tick();
    }));

    it(`doit faire disparaître le spinner lorsqu'il n'y a pas de moduleId`, () => {
        spyOn(navParams, 'get').and.callFake((value) => {
            if (value === 'moduleId') {
                return null;
            }
            return value;
        });
        failureEl = fixture.debugElement.query(By.css('edossier-spinner'));
        expect(failureEl).toEqual(null);
    });

    it('doit faire disparaître le spinner lorsque les données sont récupérées', () => {
        failureEl = fixture.debugElement.query(By.css('edossier-spinner'));
        expect(failureEl).toEqual(null);
    });

});
