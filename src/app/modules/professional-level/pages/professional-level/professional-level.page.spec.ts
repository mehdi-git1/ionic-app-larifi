import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { EObservationTransformerService } from './../../../../core/services/eobservation/eobservation-transformer.service';

const PncServiceMock = jasmine.createSpyObj('SessionServiceMock', ['getPnc']);
const SessionServiceMock = jasmine.createSpyObj('SessionServiceMock', ['isActiveUser']);
const ProfessionalLevelServiceMock = jasmine.createSpyObj('ProfessionalLevelServiceMock', ['']);
const EObservationServiceMock = jasmine.createSpyObj('EObservationServiceMock', ['getEObservations']);

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
                { provide: EObservationService, useValue: EObservationServiceMock },
                EObservationTransformerService
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

        it('doit trier les scores des modules par ordre A-T-R', () => {
            professionalLevelModel.stages[1].modules[0].scores = [
                { evaluationCode: 'T', score: 90 }, { evaluationCode: 'R', score: 90 }, { evaluationCode: 'A', score: 90 }
            ];
            const professionalLevelModelCurrent = comp.sortProfessionalLevel(professionalLevelModel);
            expect(professionalLevelModelCurrent.stages[0].modules[2].scores[0].evaluationCode).toEqual('A');
            expect(professionalLevelModelCurrent.stages[0].modules[2].scores[1].evaluationCode).toEqual('T');
            expect(professionalLevelModelCurrent.stages[0].modules[2].scores[2].evaluationCode).toEqual('R');
        });

        it('doit trier les scores des modules par ordre E1-E2-FC', () => {
            professionalLevelModel.stages[1].modules[0].scores = [
                { evaluationCode: 'E2', score: 90 }, { evaluationCode: 'FC', score: 90 }, { evaluationCode: 'E1', score: 90 }
            ];
            const professionalLevelModelCurrent = comp.sortProfessionalLevel(professionalLevelModel);
            expect(professionalLevelModelCurrent.stages[0].modules[2].scores[0].evaluationCode).toEqual('E1');
            expect(professionalLevelModelCurrent.stages[0].modules[2].scores[1].evaluationCode).toEqual('E2');
            expect(professionalLevelModelCurrent.stages[0].modules[2].scores[2].evaluationCode).toEqual('FC');
        });
    });

    describe('getEObservationsList', () => {
        it('ne doit laisser que les ecarts de notations avec "SECURITE DES VOLS" et "SURETE"', fakeAsync(() => {
            EObservationServiceMock.getEObservations.and.returnValue(Promise.resolve(testEobs));
            comp.getEObservationsList();
            tick();
            expect(comp.eObservations[0].eobservationItems.length).toBe(1);
            expect(comp.eObservations[0].eobservationItems[0].refItemLevel.item.theme.label.toUpperCase()).toBe('SURETE');
            expect(comp.eObservations[1].eobservationItems.length).toBe(0);
            expect(comp.eObservations[2].eobservationItems.length).toBe(2);
            expect(comp.eObservations[2].eobservationItems[0].refItemLevel.item.theme.label.toUpperCase()).toBe('SECURITE DES VOLS');
            expect(comp.eObservations[2].eobservationItems[1].refItemLevel.item.theme.label.toUpperCase()).toBe('SURETE');
        }));
    });


    const testEobs = [{
        'eobservationItems': [{
            'refItemLevel': {
                'item': {
                    'theme': {
                        'parent': null,
                        'label': 'RELATION CLIENT',
                        'themeOrder': 50
                    },
                    'label': 'Contact Client',
                    'shortLabel': 'Contact Client',
                    'xmlKey': 'clientContact',
                    'version': '2.0',
                    'itemOrder': 1,
                    'type': 'E_CC'
                },
                'level': 'LEVEL_4',
                'levelDescription': 'Se présente systématiquement et individuellement aux clients J/W comme le responsable de la cabine (clients ciblés en Y, M). Initie et personnalise les échanges en cours de vol et prend congé en fin de vol'
            },
            'itemOrder': 1,
            'links': []
        }, {
            'refItemLevel': {
                'item': {
                    'theme': {
                        'parent': null,
                        'label': 'SURETE',
                        'themeOrder': 30
                    },
                    'label': 'Briefing',
                    'shortLabel': 'Briefing',
                    'xmlKey': 'equipeBriefing',
                    'version': '2.0',
                    'itemOrder': 2,
                    'type': 'E_CC'
                },
                'level': 'LEVEL_4',
                'levelDescription': 'Accueille son équipe avec attention, valorise les compétences individuelles (CC/MC), fixe des objectifs clairs en cohérence avec le contexte commercial du vol, les décline de manière structurée, concise et positive, leur donne du sens  en faisant le lien avec les projets d\'Entreprise'
            },
            'itemOrder': 2,
            'links': []
        }
        ]
    }, {
        'eobservationItems': [{
            'refItemLevel': {
                'item': {
                    'theme': {
                        'parent': null,
                        'label': 'VOLS',
                        'themeOrder': 0
                    },
                    'label': 'Procédures générales d\'urgence<br>Quelles sont les particularités de l\'intervention sur un feu ou de la fumée d\'un appareil électronique en cabine ?',
                    'shortLabel': 'Procédures générales d\'urgence',
                    'xmlKey': 'procedureAppareilElec201605',
                    'version': '1.0',
                    'itemOrder': 1,
                    'type': 'E_CC'
                },
                'level': 'LEVEL_3',
                'levelDescription': 'Maitrisé : Le PNC connaît la procédure'
            },
            'itemOrder': 0,
            'links': []
        }
        ]
    }, {
        'eobservationItems': [{
            'refItemLevel': {
                'item': {
                    'theme': {
                        'parent': null,
                        'label': 'SECURITE DES VOLS',
                        'themeOrder': 0
                    },
                    'label': 'Analyse des paramètres du vol',
                    'shortLabel': 'Analyse des paramètres du vol',
                    'xmlKey': 'securiteAnalyseParametresVol',
                    'version': '1.0',
                    'itemOrder': 3,
                    'type': 'E_CC'
                },
                'level': 'LEVEL_3',
                'levelDescription': 'Analyse et hiérarchise l\'ensemble des informations SV nécessaires à la réalisation du vol et les actualise régulièrement'
            },
            'itemOrder': 0,
            'links': []
        }, {
            'refItemLevel': {
                'item': {
                    'theme': {
                        'parent': null,
                        'label': 'SURETE',
                        'themeOrder': 0
                    },
                    'label': 'Briefing départ',
                    'shortLabel': 'Briefing départ',
                    'xmlKey': 'securiteBriefingDepart',
                    'version': '1.0',
                    'itemOrder': 4,
                    'type': 'E_CC'
                },
                'level': 'LEVEL_3',
                'levelDescription': 'Délivre un briefing départ en conformité avec les exigences réglementaires'
            },
            'itemOrder': 1,
            'links': []
        }
        ]
    }];

});
