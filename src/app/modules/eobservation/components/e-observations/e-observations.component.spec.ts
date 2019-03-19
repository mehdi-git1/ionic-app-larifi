import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { TranslateLoaderMock } from './../../../../../test-config/mocks-ionic';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EObservationsComponent } from './e-observations.component';
import { EObservationItemModel } from '../../../../core/models/eobservation/eobservation-item.model';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/referential-item-level.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { ReferentialItemModel } from '../../../../core/models/eobservation/referential-item.model';
import { ReferentialThemeModel } from '../../../../core/models/eobservation/referential-theme.model';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';

describe('EObservationsComponent', () => {

    let fixture: ComponentFixture<EObservationsComponent>;
    let comp: EObservationsComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EObservationsComponent
            ],
            imports: [
                IonicModule.forRoot(EObservationsComponent),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(EObservationsComponent);
        comp = fixture.componentInstance;
        comp.eObservations = [new EObservationModel, new EObservationModel];
    });

    describe('defineLegendMessage', () => {

        it(`doit mettre la variable isOlderThan3Years à true si une eObservation a plus de 3 ans`, () => {
            comp.eObservations[0].rotationDate = new Date();
            comp.eObservations[1].rotationDate = new Date('01/01/2015');
            comp.defineLegendMessage();
            expect(comp.isOlderThan3Years).toBe(true);
        });

        it(`doit mettre la variable isOlderThan3Years à false si une eObservation a plus de 3 ans`, () => {
            comp.eObservations[0].rotationDate = new Date();
            comp.eObservations[1].rotationDate = new Date('31/01/2016');
            comp.defineLegendMessage();
            expect(comp.isOlderThan3Years).toBe(false);
        });
    });

    describe('filterEobsItems', () => {
        it('ne doit laisser que les ecarts de notations avec "SECURITE DES VOLS" et "SURETE"', fakeAsync(() => {
            comp.filterItems = true;
            const filteredEObservation: EObservationModel = comp.filterEobsItems(eObservation);
            console.log(filteredEObservation);
            expect(filteredEObservation.eobservationItems.length).toBe(1);
            expect(filteredEObservation.eobservationItems[0].refItemLevel.item.theme.label.toUpperCase()).toBe('SURETE');
        }));
    });

    const eObservation: EObservationModel = new EObservationModel();
    eObservation.eobservationItems = new Array();
    const eobservationItem: EObservationItemModel = new EObservationItemModel();
    eobservationItem.itemOrder = 1;
    eobservationItem.refItemLevel = new ReferentialItemLevelModel();
    eobservationItem.refItemLevel.level = EObservationLevelEnum.LEVEL_4;
    eobservationItem.refItemLevel.levelDescription = 'Se présente systématiquement et individuellement aux clients J/W comme le responsable de la cabine (clients ciblés en Y, M). Initie et personnalise les échanges en cours de vol et prend congé en fin de vol';
    eobservationItem.refItemLevel.item = new ReferentialItemModel();
    eobservationItem.refItemLevel.item.theme = new ReferentialThemeModel();
    eobservationItem.refItemLevel.item.theme.themeOrder = 50;
    eobservationItem.refItemLevel.item.theme.label = 'RELATION CLIENT';
    eobservationItem.refItemLevel.item.label = 'Contact Client';
    eobservationItem.refItemLevel.item.shortLabel = 'Contact Client';
    eobservationItem.refItemLevel.item.xmlKey = 'clientContact';
    eobservationItem.refItemLevel.item.version = '2.0';
    eobservationItem.refItemLevel.item.itemOrder = 1;
    eobservationItem.refItemLevel.item.type = EObservationTypeEnum.E_CC;
    eObservation.eobservationItems.push(eobservationItem);
    const eobservationItem2: EObservationItemModel = new EObservationItemModel();
    eobservationItem2.itemOrder = 1;
    eobservationItem2.refItemLevel = new ReferentialItemLevelModel();
    eobservationItem2.refItemLevel.level = EObservationLevelEnum.LEVEL_4;
    eobservationItem2.refItemLevel.levelDescription = 'Accueille son équipe avec attention, valorise les compétences individuelles (CC/MC), fixe des objectifs clairs en cohérence avec le contexte commercial du vol, les décline de manière structurée, concise et positive, leur donne du sens  en faisant le lien avec les projets d\'Entreprise';
    eobservationItem2.refItemLevel.item = new ReferentialItemModel();
    eobservationItem2.refItemLevel.item.theme = new ReferentialThemeModel();
    eobservationItem2.refItemLevel.item.theme.themeOrder = 30;
    eobservationItem2.refItemLevel.item.theme.label = 'SURETE';
    eobservationItem2.refItemLevel.item.theme.displayedInProfessionalLevel = true;
    eobservationItem2.refItemLevel.item.label = 'Briefing';
    eobservationItem2.refItemLevel.item.shortLabel = 'Briefing';
    eobservationItem2.refItemLevel.item.xmlKey = 'equipeBriefing';
    eobservationItem2.refItemLevel.item.version = '2.0';
    eobservationItem2.refItemLevel.item.itemOrder = 2;
    eobservationItem2.refItemLevel.item.type = EObservationTypeEnum.E_CC;
    eObservation.eobservationItems.push(eobservationItem2);

});
