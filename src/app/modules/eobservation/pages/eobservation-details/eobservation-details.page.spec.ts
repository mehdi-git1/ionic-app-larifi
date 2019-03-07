import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, NavParams, NavController } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateLoaderMock, NavMock } from './../../../../../test-config/mocks-ionic';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { EobservationDetailsPage } from './eobservation-details.page';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { EObservationFlightModel } from '../../../../core/models/eobservation/eobservation-flight.model';
import { EObservationStateEnum } from '../../../../core/enums/e-observation-state.enum';
import { TranslateOrEmptyPipe } from '../../../../shared/pipes/translate-or-empty/translate-or-empty.pipe';
import { TranslateOrEmptyService } from '../../../../core/services/translate/translate-or-empty.service';

const EObservationServiceMock = jasmine.createSpyObj('EObservationServiceMock', ['getEObservations']);
const translateOrEmptyServiceMock = jasmine.createSpyObj('translateOrEmptyServiceMock', ['transform']);
describe('EobservationDetailsPage', () => {

    let fixture: ComponentFixture<EobservationDetailsPage>;
    let comp: EobservationDetailsPage;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EobservationDetailsPage, TranslateOrEmptyPipe
            ],
            imports: [
                IonicModule.forRoot(EobservationDetailsPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: NavParams, useClass: NavMock },
                { provide: NavController, useClass: NavMock },
                { provide: TranslateOrEmptyService, useValue: translateOrEmptyServiceMock },
                { provide: EObservationService, useValue: EObservationServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(EobservationDetailsPage);
        comp = fixture.componentInstance;
    });

    describe('hasFlights', () => {
        it(`Renvoie false si l'eobs est nulle`, () => {
            expect(comp).toBeDefined();
            expect(comp.hasFlights()).toBe(false);
        });

        it(`Renvoie false si la liste des vols de l'eobs est vide`, () => {
            expect(comp).toBeDefined();
            comp.eObservation = new EObservationModel();
            comp.eObservation.eobservationFlights = new Array();
            expect(comp.hasFlights()).toBe(false);
        });

        it(`Renvoie true si il y a au moins 1 vol`, () => {
            expect(comp).toBeDefined();
            comp.eObservation = new EObservationModel();
            comp.eObservation.eobservationFlights = new Array();
            comp.eObservation.eobservationFlights.push(new EObservationFlightModel());
            expect(comp.hasFlights()).toBe(true);
        });
    });

    describe('getColorStatusPoint', () => {
        it(`Renvoie null si l'eobs est nulle`, () => {
            expect(comp).toBeDefined();
            expect(comp.getColorStatusPoint()).toBeUndefined();
        });

        it(`Renvoie null si pas de statut dans l'eobs`, () => {
            expect(comp).toBeDefined();
            comp.eObservation = new EObservationModel();
            expect(comp.getColorStatusPoint()).toBeUndefined();
        });

        it(`Renvoie green si le statut de l'eobs est TAKEN_INTO_ACCOUNT`, () => {
            expect(comp).toBeDefined();
            comp.eObservation = new EObservationModel();
            comp.eObservation.state = EObservationStateEnum.TAKEN_INTO_ACCOUNT;
            expect(comp.getColorStatusPoint()).toBe('green');
        });

        it(`Renvoie red si le statut de l'eobs est NOT_TAKEN_INTO_ACCOUNT`, () => {
            expect(comp).toBeDefined();
            comp.eObservation = new EObservationModel();
            comp.eObservation.state = EObservationStateEnum.NOT_TAKEN_INTO_ACCOUNT;
            expect(comp.getColorStatusPoint()).toBe('red');
        });

    });

    describe('sortedFlights', () => {
        it(`Trie les vols si l'eobs a des vols`, () => {
            expect(comp).toBeDefined();
            comp.eObservation = new EObservationModel();
            comp.eObservation.eobservationFlights = new Array();
            const flight2 = new EObservationFlightModel();
            flight2.flightOrder = 2;
            const flight1 = new EObservationFlightModel();
            flight1.flightOrder = 1;
            const flight3 = new EObservationFlightModel();
            flight3.flightOrder = 3;
            comp.eObservation.eobservationFlights.push(flight2);
            comp.eObservation.eobservationFlights.push(flight3);
            comp.eObservation.eobservationFlights.push(flight1);
            const flights = comp.sortedFlights();
            expect(flights[0].flightOrder).toBe(1);
            expect(flights[1].flightOrder).toBe(2);
            expect(flights[2].flightOrder).toBe(3);
        });
    });
});
