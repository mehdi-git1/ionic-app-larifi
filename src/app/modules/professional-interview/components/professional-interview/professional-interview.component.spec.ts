import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import {
    ProfessionalInterviewStateEnum
} from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import {
    TranslateOrEmptyService
} from '../../../../core/services/translate/translate-or-empty.service';
import {
    TranslateOrEmptyPipe
} from '../../../../shared/pipes/translate-or-empty/translate-or-empty.pipe';
import { ProfessionalInterviewComponent } from './professional-interview.component';

const translateOrEmptyServiceMock = jasmine.createSpyObj('translateOrEmptyServiceMock', ['transform']);
const TranslateLoaderMock = jasmine.createSpyObj('TranslateLoaderMock', ['instant']);

describe('ProfessionalInterviewComponent', () => {

    let fixture: ComponentFixture<ProfessionalInterviewComponent>;
    let comp: ProfessionalInterviewComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProfessionalInterviewComponent, TranslateOrEmptyPipe
            ],
            imports: [
                IonicModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: TranslateOrEmptyService, useValue: translateOrEmptyServiceMock },
                Router
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(ProfessionalInterviewComponent);
        comp = fixture.componentInstance;
    });

    describe('getColorStatusPoint', () => {
        it(`Renvoie null si le bilan pro est nulle`, () => {
            expect(comp).toBeDefined();
            expect(comp.getColorStatusPoint()).toBeUndefined();
        });

        it(`Renvoie null si pas de statut dans le bilan pro`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            expect(comp.getColorStatusPoint()).toBeUndefined();
        });

        it(`Renvoie green si le statut du bilan pro est TAKEN_INTO_ACCOUNT`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            comp.professionalInterview.state = ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT;
            expect(comp.getColorStatusPoint()).toBe('green');
        });

        it(`Renvoie red si le statut du bilan pro est NOT_TAKEN_INTO_ACCOUNT`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            comp.professionalInterview.state = ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT;
            expect(comp.getColorStatusPoint()).toBe('red');
        });

        it(`Renvoie orange si le statut du bilan pro est CONSULTED`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            comp.professionalInterview.state = ProfessionalInterviewStateEnum.CONSULTED;
            expect(comp.getColorStatusPoint()).toBe('orange');
        });

        it(`Renvoie red si le statut du bilan pro est DRAFT`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            comp.professionalInterview.state = ProfessionalInterviewStateEnum.DRAFT;
            expect(comp.getColorStatusPoint()).toBe('grey');
        });

    });

});
