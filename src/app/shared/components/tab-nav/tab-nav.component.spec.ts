import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule, Events } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TranslateLoaderMock } from '../../../../test-config/mocks-ionic';
import { TabNavComponent } from './tab-nav.component';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { of } from 'rxjs/observable/of';
import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';
import { SpecialityService } from '../../../core/services/speciality/speciality.service';
import { SecurityServer } from '../../../core/services/security/security.server';
import { SessionService } from '../../../core/services/session/session.service';
import { SummarySheetService } from './../../../core/services/summary-sheet/summary-sheet.service';
import { SummarySheetTransformerService } from '../../../core/services/summary-sheet/summary-sheet-transformer.service';
import { FileService } from './../../../core/file/file.service';
import { PncModel } from '../../../core/models/pnc.model';

const PncProviderMock = jasmine.createSpyObj('PncProviderMock', ['getPnc']);
PncProviderMock.getPnc.and.returnValue(of({}));

const SecurityProviderMock = jasmine.createSpyObj('SecurityProviderMock', ['']);

const SessionServiceMock = jasmine.createSpyObj('SessionServiceMock', ['']);

const SummarySheetServiceMock = jasmine.createSpyObj('SummarySheetServiceMock', ['getSummarySheet']);

describe('tab-nav component', () => {

    let fixture: ComponentFixture<TabNavComponent>;
    let comp: TabNavComponent;
    let EventsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TabNavComponent],
            imports: [
                IonicModule.forRoot(TabNavComponent),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                TabNavService,
                Events,
                { provide: SessionService, useValue: SessionServiceMock },
                { provide: SecurityServer, useValue: SecurityProviderMock },
                { provide: PncService, useValue: PncProviderMock },
                SpecialityService,
                { provide: SummarySheetService, useValue: SummarySheetServiceMock },
                { provide: SummarySheetTransformerService },
                { provide: FileService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(TabNavComponent);
        comp = fixture.componentInstance;
        comp.navCtrl = jasmine.createSpyObj('NavMock', ['setRoot']);
        comp.loading = false;
        EventsService = TestBed.get(Events);
        comp.pnc = new PncModel();
    });

    describe('authenticationLogout', () => {
        it('doit verifier si on cache bien la tabnav (loading = true)', () => {
            EventsService.publish('user:authenticationLogout');
            EventsService.subscribe('user:authenticationLogout', () => {
                expect(comp.loading).toBe(true);
            });
        });
    });

    describe('tabChange', () => {
        let event;
        beforeEach(() => {
            event = {
                root: {
                    name: 'testRootName'
                },
                rootParams: {
                    data: 'testData'
                }
            };
            spyOn(comp, 'summarySheetDisplay');
            comp.pnc.matricule = 't447744';
        });

        it('doit changer la valeur du nom du pageName de l\'event changeTab', () => {
            EventsService.subscribe('changeTab', (data) => {
                expect(data.pageName).toBe('testRootName');
            });
            comp.tabChange(event);
        });

        it('doit changer la valeur du pageParams de la page de l\'event changeTab', () => {
            EventsService.subscribe('changeTab', (data) => {
                const objReturn = { 'data': 'testData' };
                expect(data.pageParams).toEqual(objReturn);
            });
            comp.tabChange(event);
        });

        it(`doit activer l'affichage de la fiche synthèse si on clic sur fiche synthèse`, () => {
            event.tabTitle = 'GLOBAL.PNC_SUMMARY_SHEET';
            comp.tabChange(event);
            expect(comp.summarySheetDisplay).toHaveBeenCalled();
        });


        it(`ne doit pas activer l'affichage de la fiche synthèse si on clic sur l'effectif PNC`, () => {
            event.tabTitle = 'GLOBAL.PNC_TEAM';
            comp.tabChange(event);
            expect(comp.summarySheetDisplay).not.toHaveBeenCalled();
        });



    });
});
