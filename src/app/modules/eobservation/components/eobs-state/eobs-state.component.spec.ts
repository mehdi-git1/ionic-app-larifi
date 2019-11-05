import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { EObservationStateEnum } from '../../../../core/enums/e-observation-state.enum';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import {
    TranslateOrEmptyService
} from '../../../../core/services/translate/translate-or-empty.service';
import {
    TranslateOrEmptyPipe
} from '../../../../shared/pipes/translate-or-empty/translate-or-empty.pipe';
import { EObsStateComponent } from './eobs-state.component';

const translateOrEmptyServiceMock = jasmine.createSpyObj('translateOrEmptyServiceMock', ['transform']);
const TranslateLoaderMock = jasmine.createSpyObj('TranslateLoaderMock', ['instant']);

describe('EObsRotationInfoComponent', () => {

    let fixture: ComponentFixture<EObsStateComponent>;
    let eObsStateComponent: EObsStateComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                EObsStateComponent,
                TranslateOrEmptyPipe
            ],
            imports: [
                IonicModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                })
            ],
            providers: [
                { provide: TranslateOrEmptyService, useValue: translateOrEmptyServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EObsStateComponent);
        eObsStateComponent = fixture.componentInstance;
    });

    describe('getColorStatusPoint', () => {
        it(`Renvoie null si l'eobs est nulle`, () => {
            expect(eObsStateComponent).toBeDefined();
            expect(eObsStateComponent.getColorStatusPoint()).toBeUndefined();
        });

        it(`Renvoie null si pas de statut dans l'eobs`, () => {
            expect(eObsStateComponent).toBeDefined();
            eObsStateComponent.eObservation = new EObservationModel();
            expect(eObsStateComponent.getColorStatusPoint()).toBeUndefined();
        });

        it(`Renvoie green si le statut de l'eobs est TAKEN_INTO_ACCOUNT`, () => {
            expect(eObsStateComponent).toBeDefined();
            eObsStateComponent.eObservation = new EObservationModel();
            eObsStateComponent.eObservation.state = EObservationStateEnum.TAKEN_INTO_ACCOUNT;
            expect(eObsStateComponent.getColorStatusPoint()).toBe('green');
        });

        it(`Renvoie red si le statut de l'eobs est NOT_TAKEN_INTO_ACCOUNT`, () => {
            expect(eObsStateComponent).toBeDefined();
            eObsStateComponent.eObservation = new EObservationModel();
            eObsStateComponent.eObservation.state = EObservationStateEnum.NOT_TAKEN_INTO_ACCOUNT;
            expect(eObsStateComponent.getColorStatusPoint()).toBe('red');
        });

    });
});
