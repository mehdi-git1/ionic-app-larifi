import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { EObservationsComponent } from './e-observations.component';

const TranslateLoaderMock = jasmine.createSpyObj('TranslateLoaderMock', ['instant']);

describe('EObservationsComponent', () => {

    let fixture: ComponentFixture<EObservationsComponent>;
    let comp: EObservationsComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EObservationsComponent
            ],
            imports: [
                IonicModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useValue: TranslateLoaderMock }
                })
            ],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(EObservationsComponent);
        comp = fixture.componentInstance;
        comp.eObservations = [new EObservationModel(), new EObservationModel()];
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

});
