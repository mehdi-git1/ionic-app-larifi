import { ProfessionalInterviewComponent } from './professional-interview.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateLoaderMock, NavMock } from '../../../../../test-config/mocks-ionic';
import { TranslateOrEmptyPipe } from '../../../../shared/pipes/translate-or-empty/translate-or-empty.pipe';
import { TranslateOrEmptyService } from '../../../../core/services/translate/translate-or-empty.service';
import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';
import { ProfessionalInterviewStateEnum } from '../../../../core/enums/professional-interview/professional-interview-state.enum';

const translateOrEmptyServiceMock = jasmine.createSpyObj('translateOrEmptyServiceMock', ['transform']);

describe('ProfessionalInterviewComponent', () => {

    let fixture: ComponentFixture<ProfessionalInterviewComponent>;
    let comp: ProfessionalInterviewComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProfessionalInterviewComponent, TranslateOrEmptyPipe
            ],
            imports: [
                IonicModule.forRoot(ProfessionalInterviewComponent),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: TranslateOrEmptyService, useValue: translateOrEmptyServiceMock },
                { provide: NavController, useClass: NavMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(ProfessionalInterviewComponent);
        comp = fixture.componentInstance;
    });

    describe('getColorStatusPoint', () => {
        it(`Renvoie null si l'eobs est nulle`, () => {
            expect(comp).toBeDefined();
            expect(comp.getColorStatusPoint()).toBeUndefined();
        });

        it(`Renvoie null si pas de statut dans l'eobs`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            expect(comp.getColorStatusPoint()).toBeUndefined();
        });

        it(`Renvoie green si le statut de l'eobs est TAKEN_INTO_ACCOUNT`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            comp.professionalInterview.state = ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT;
            expect(comp.getColorStatusPoint()).toBe('green');
        });

        it(`Renvoie red si le statut de l'eobs est NOT_TAKEN_INTO_ACCOUNT`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            comp.professionalInterview.state = ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT;
            expect(comp.getColorStatusPoint()).toBe('red');
        });

        it(`Renvoie red si le statut de l'eobs est AVAILABLE`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            comp.professionalInterview.state = ProfessionalInterviewStateEnum.AVAILABLE;
            expect(comp.getColorStatusPoint()).toBe('orange');
        });

        it(`Renvoie red si le statut de l'eobs est DRAFT`, () => {
            expect(comp).toBeDefined();
            comp.professionalInterview = new ProfessionalInterviewModel();
            comp.professionalInterview.state = ProfessionalInterviewStateEnum.DRAFT;
            expect(comp.getColorStatusPoint()).toBe('grey');
        });

    });

});
