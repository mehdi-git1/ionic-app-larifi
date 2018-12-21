import { ReplaceByPointPipe } from './../../../../../shared/pipes/replace-by-point/replaceByPoint.pipe';
import { ModuleModel } from './../../../../../core/models/professional-level/module.model';
import { EvaluationSheetService } from './../../../../../core/services/professional-level/evaluation-sheet/evaluation-sheet.service';
import { ProfessionalLevelService } from './../../../../../core/services/professional-level/professional-level.service';
import { TranslateLoaderMock, NavMock } from './../../../../../../test-config/mocks-ionic';
import { EvaluationSheetPage } from './evaluation-sheet.page';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavParams } from 'ionic-angular';
import { async, TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';


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


describe('EvaluationSheetPage', () => {

    let fixture: ComponentFixture<EvaluationSheetPage>;
    let comp: EvaluationSheetPage;
    let failureEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EvaluationSheetPage,
                ReplaceByPointPipe
            ],
            imports: [
                IonicModule.forRoot(EvaluationSheetPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: NavParams, useClass: NavMock },
                { provide: EvaluationSheetService, useValue: EvaluationSheetServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(EvaluationSheetPage);
        comp = fixture.componentInstance;
    });

    beforeEach(fakeAsync(() => {
        comp.loadData();
        tick();
    }));

    it('doit afficher la bonne classe en fonction du code résultat', () => {
        expect(comp).toBeDefined();
        comp.evaluationSheet.module.moduleResultStatus = 'FAILED';
        fixture.detectChanges();
        failureEl = fixture.debugElement.query(By.css('.result'));
        expect(failureEl.nativeElement.className).toContain(comp.getCssClassForModuleStatus(comp.evaluationSheet.module.moduleResultStatus));
    });

    it('doit faire disparaître le spinner lorsque les données sont récupérées', () => {
        failureEl = fixture.debugElement.query(By.css('edossier-spinner'));
        expect(failureEl).toEqual(null);
    });

});
