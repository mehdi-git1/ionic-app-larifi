import { EvaluationSheetService } from './../../../../../core/services/professional-level/evaluation-sheet/evaluation-sheet.service';
import { ProfessionalLevelService } from './../../../../../core/services/professional-level/professional-level.service';
import { TranslateLoaderMock, NavMock } from './../../../../../../test-config/mocks-ionic';
import { EvaluationSheetPage } from './evaluation-sheet.page';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavParams } from 'ionic-angular';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';


const testEvaluationSheetData = {
    techID: '7785',
    title: 'Désarmement toboggan',
    evaluations: [{
        text: 'Placer le sélecteur sur disarmed',
        types: { E1: '70%' }
    },
    {
        text: 'Insérer la goupille de sécurité',
        types: { E1: '70%', E2: '80%' }
    }]
};

const EvaluationSheetServiceMock = jasmine.createSpyObj('EvaluationSheetServiceMock', ['getPracticalEvaluationSheet']);
EvaluationSheetServiceMock.getEvaluationSheet.and.returnValue(Promise.resolve(testEvaluationSheetData));


describe('EvaluationSheetPage', () => {

    let fixture: ComponentFixture<EvaluationSheetPage>;
    let comp: EvaluationSheetPage;
    let failureEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EvaluationSheetPage
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

    beforeEach(async () => {
        comp.loadData();
    });

    it('doit afficher la bonne classe en fonction du code résultat', () => {
        expect(comp).toBeDefined();
        comp.evaluationSheetModel.evaluations['E1'] = 'failure';
        fixture.detectChanges();
        failureEl = fixture.debugElement.query(By.css('.result'));
        expect(failureEl.nativeElement.className).toContain(comp.evaluationSheetModel.evaluations['E1']);
    });

    describe('Gestion du spinner et du chargement des données', () => {
        beforeEach(async(() => {
            comp.loading = true;
            comp.loadData();
        }));

        it('doit mettre la variable loading a false lorsque les données sont récupérées', () => {
            expect(comp.loading).toEqual(false);
        });

        it('doit faire disparaître le spinner lorsque les données sont récupérées', () => {
            fixture.detectChanges();
            failureEl = fixture.debugElement.query(By.css('ion-spinner'));
            expect(failureEl).toEqual(null);
        });
    });

});
