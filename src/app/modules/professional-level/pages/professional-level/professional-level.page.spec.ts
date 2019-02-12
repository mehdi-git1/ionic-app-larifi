import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProfessionalLevelPage } from './professional-level.page';
import { ModuleModel } from './../../../../core/models/professional-level/module.model';
import { StageModel } from './../../../../core/models/professional-level/stage.model';
import { IsMyPage } from './../../../../shared/pipes/is_my_page/is_my_page.pipe';
import { SessionService } from './../../../../core/services/session/session.service';
import { TranslateLoaderMock, NavMock } from './../../../../../test-config/mocks-ionic';
import { ProfessionalLevelService } from '../../../../core/services/professional-level/professional-level.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { ProfessionalLevelModel } from '../../../../core/models/professional-level/professional-level.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';

const PncServiceMock = jasmine.createSpyObj('SessionServiceMock', ['getPnc']);
const SessionServiceMock = jasmine.createSpyObj('SessionServiceMock', ['isActiveUser']);
const ProfessionalLevelServiceMock = jasmine.createSpyObj('ProfessionalLevelServiceMock', ['']);
const EObservationServiceMock = jasmine.createSpyObj('EObservationServiceMock', ['']);

describe('ProfessionalLevelPage', () => {

    let fixture: ComponentFixture<ProfessionalLevelPage>;
    let comp: ProfessionalLevelPage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProfessionalLevelPage,
                IsMyPage
            ],
            imports: [
                IonicModule.forRoot(ProfessionalLevelPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: NavParams, useClass: NavMock },
                { provide: ProfessionalLevelService, useValue: ProfessionalLevelServiceMock },
                { provide: SessionService, useValue: SessionServiceMock },
                { provide: PncService, useValue: PncServiceMock },
                { provide: EObservationService, useValue: EObservationServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(ProfessionalLevelPage);
        comp = fixture.componentInstance;
    });

    describe('sortProfessionalLevel', () => {

        let professionalLevelModel: ProfessionalLevelModel;
        professionalLevelModel = new ProfessionalLevelModel();

        beforeEach(() => {
            professionalLevelModel.stages = [new StageModel(), new StageModel(), new StageModel()];
            professionalLevelModel.stages[0].date = new Date('01/01/2019');
            professionalLevelModel.stages[1].date = new Date('01/03/2019');
            professionalLevelModel.stages[2].date = new Date('01/02/2019');

            // On met sur le stage 1 car il sera en tete de la liste apres le tri des stages
            professionalLevelModel.stages[1].modules = [new ModuleModel(), new ModuleModel(), new ModuleModel()];
            professionalLevelModel.stages[1].modules[0].date = new Date('01/01/2019');
            professionalLevelModel.stages[1].modules[1].date = new Date('01/03/2019');
            professionalLevelModel.stages[1].modules[2].date = new Date('01/02/2019');
        });

        it(`ne doit pas modifier l'objet s'il n'y a pas de stages`, () => {
            expect(comp).toBeDefined();
            professionalLevelModel = new ProfessionalLevelModel();
            expect(comp.sortProfessionalLevel(professionalLevelModel)).toEqual(professionalLevelModel);
        });

        it('doit trier les stages chronologiquement (descendant) selon leur date', () => {
            expect(comp).toBeDefined();
            const professionalLevelModelCurrent = comp.sortProfessionalLevel(professionalLevelModel);
            expect(professionalLevelModelCurrent.stages[0].date).toEqual(new Date('01/03/2019'));
            expect(professionalLevelModelCurrent.stages[1].date).toEqual(new Date('01/02/2019'));
            expect(professionalLevelModelCurrent.stages[2].date).toEqual(new Date('01/01/2019'));
        });

        it('doit trier les modules des stages chronologiquement (descendant) sur leur date', () => {
            expect(comp).toBeDefined();
            const professionalLevelModelCurrent = comp.sortProfessionalLevel(professionalLevelModel);
            expect(professionalLevelModelCurrent.stages[0].modules[0].date).toEqual(new Date('01/03/2019'));
            expect(professionalLevelModelCurrent.stages[0].modules[1].date).toEqual(new Date('01/02/2019'));
            expect(professionalLevelModelCurrent.stages[0].modules[2].date).toEqual(new Date('01/01/2019'));
        });
    });

});
