import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import {
    EObservationFlightModel
} from '../../../../core/models/eobservation/eobservation-flight.model';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { EObsRotationInfoComponent } from './eobs-rotation-info.component';

const TranslateLoaderMock = jasmine.createSpyObj('TranslateLoaderMock', ['instant']);

describe('EObsRotationInfoComponent', () => {

    let fixture: ComponentFixture<EObsRotationInfoComponent>;
    let eObsRotationInfoComponent: EObsRotationInfoComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EObsRotationInfoComponent],
            imports: [
                IonicModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useValue: TranslateLoaderMock }
                })
            ],
            providers: [
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EObsRotationInfoComponent);
        eObsRotationInfoComponent = fixture.componentInstance;
    });

    describe('hasFlights', () => {
        it(`Renvoie false si l'eobs est nulle`, () => {
            expect(eObsRotationInfoComponent).toBeDefined();
            expect(eObsRotationInfoComponent.hasFlights()).toBe(false);
        });

        it(`Renvoie false si la liste des vols de l'eobs est vide`, () => {
            expect(eObsRotationInfoComponent).toBeDefined();
            eObsRotationInfoComponent.eObservation = new EObservationModel();
            eObsRotationInfoComponent.eObservation.eobservationFlights = new Array();
            expect(eObsRotationInfoComponent.hasFlights()).toBe(false);
        });

        it(`Renvoie true si il y a au moins 1 vol`, () => {
            expect(eObsRotationInfoComponent).toBeDefined();
            eObsRotationInfoComponent.eObservation = new EObservationModel();
            eObsRotationInfoComponent.eObservation.eobservationFlights = new Array();
            eObsRotationInfoComponent.eObservation.eobservationFlights.push(new EObservationFlightModel());
            expect(eObsRotationInfoComponent.hasFlights()).toBe(true);
        });
    });



    describe('sortedFlights', () => {
        it(`Trie les vols si l'eobs a des vols`, () => {
            expect(eObsRotationInfoComponent).toBeDefined();
            eObsRotationInfoComponent.eObservation = new EObservationModel();
            eObsRotationInfoComponent.eObservation.eobservationFlights = new Array();
            const flight2 = new EObservationFlightModel();
            flight2.flightOrder = 2;
            const flight1 = new EObservationFlightModel();
            flight1.flightOrder = 1;
            const flight3 = new EObservationFlightModel();
            flight3.flightOrder = 3;
            eObsRotationInfoComponent.eObservation.eobservationFlights.push(flight2);
            eObsRotationInfoComponent.eObservation.eobservationFlights.push(flight3);
            eObsRotationInfoComponent.eObservation.eobservationFlights.push(flight1);
            const flights = eObsRotationInfoComponent.sortedFlights();
            expect(flights[0].flightOrder).toBe(1);
            expect(flights[1].flightOrder).toBe(2);
            expect(flights[2].flightOrder).toBe(3);
        });
    });
});
