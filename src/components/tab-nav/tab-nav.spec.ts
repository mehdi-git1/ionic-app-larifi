import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule, Events } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TranslateLoaderMock } from '../../test-config/mocks-ionic';
import { TabNavComponent } from './tab-nav';
import { PncProvider } from './../../providers/pnc/pnc';
import { of } from 'rxjs/observable/of';

const PncProviderMock = jasmine.createSpyObj('PncProviderMock', ['getPnc']);
PncProviderMock.getPnc.and.returnValue(of({}));

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
                Events,
                { provide: PncProvider, useValue: PncProviderMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(TabNavComponent);
        comp = fixture.componentInstance;
        EventsService = TestBed.get(Events);
    });

    describe('fonction tabChange, tests au changement de tab', () => {
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

    });
});
