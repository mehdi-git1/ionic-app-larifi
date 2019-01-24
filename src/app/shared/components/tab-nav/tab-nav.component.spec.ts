import { TabNavEnum } from './../../../core/enums/tab-nav.enum';
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
import { SecurityService } from '../../../core/services/security/security.service';
import { SessionService } from '../../../core/services/session/session.service';
import { SummarySheetService } from './../../../core/services/summary-sheet/summary-sheet.service';
import { SummarySheetTransformerService } from '../../../core/services/summary-sheet/summary-sheet-transformer.service';
import { FileService } from './../../../core/file/file.service';
import { PncModel } from '../../../core/models/pnc.model';
import { IsMyPage } from '../../pipes/is_my_page/is_my_page.pipe';


const pncProviderMock = jasmine.createSpyObj('pncProviderMock', ['getPnc']);
pncProviderMock.getPnc.and.returnValue(of({}));

const securityProviderMock = jasmine.createSpyObj('securityProviderMock', ['']);

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['']);

const summarySheetServiceMock = jasmine.createSpyObj('summarySheetServiceMock', ['openSummarySheet']);

describe('tab-nav component', () => {

    let fixture: ComponentFixture<TabNavComponent>;
    let comp: TabNavComponent;
    let EventsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TabNavComponent
            ],
            imports: [
                IonicModule.forRoot(TabNavComponent),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                TabNavService,
                Events,
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: SecurityService, useValue: securityProviderMock },
                { provide: PncService, useValue: pncProviderMock },
                SpecialityService,
                { provide: SummarySheetService, useValue: summarySheetServiceMock },
                { provide: SummarySheetTransformerService },
                { provide: FileService },
                IsMyPage
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

        it('doit appeler la méthode openSummarySheet si l\'onglet sélectionné est la fiche synthèse', () => {
            event.rootParams.page = TabNavEnum.SUMMARY_SHEET_PAGE;
            comp.tabChange(event);
            expect(summarySheetServiceMock.openSummarySheet).toHaveBeenCalled();
        });
    });
});
