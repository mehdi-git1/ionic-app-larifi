import { IonicModule, NavController, Platform } from 'ionic-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { EObservationService } from './eobservation.service';
import { EObservationModel } from '../../models/eobservation/eobservation.model';
import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';
import { TranslateLoaderMock } from '../../../../test-config/mocks-ionic';

const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['setConnected']);
const onlineEObservationServiceMock = jasmine.createSpyObj('onlineEObservationServiceMock', ['']);
const offlineEObservationServiceMock = jasmine.createSpyObj('offlineEObservationServiceMock', ['']);
const translateServiceMock = jasmine.createSpyObj('translateServiceMock', ['instant'])
translateServiceMock.instant.and.returnValue();
describe('EObservationComponent', () => {

    let eObservationService: EObservationService;
    beforeEach(() => {
      eObservationService = new EObservationService(connectivityServiceMock, onlineEObservationServiceMock, offlineEObservationServiceMock, translateServiceMock);
    });

    describe('getDetailOptionType', () => {
        it(`Le détail doit être vide si l'eobs n'est ni de type ECC ni de type ECCP même si val = true et/ou c'est un vol de formation`, () => {
            const eObservation = new EObservationModel();
            eObservation.val = true;
            eObservation.formationFlight = true;
            eObservationService.getDetailOptionType(eObservation);
            expect(translateServiceMock.instant).not.toHaveBeenCalled();
        });

        it(`Le détail doit être ' - VAL' si l'eobs est de type ECC et que val = true`, () => {
            const eObservation =  new EObservationModel();
            eObservation.type= EObservationTypeEnum.E_CC;
            eObservation.val = true;
            eObservationService.getDetailOptionType(eObservation);
            expect(translateServiceMock.instant).toHaveBeenCalledWith('EOBSERVATION.DETAILS.VAL_TITLE_OPTION');
        });
        it(`Le détail doit être ' - FOR' si l'eobs est de type ECC et que c'est un vol de formation`, () => {
            const eObservation = new EObservationModel();
            eObservation.type= EObservationTypeEnum.E_CC;
            eObservation.formationFlight = true;
            eObservationService.getDetailOptionType(eObservation)
            expect(translateServiceMock.instant).toHaveBeenCalledWith('EOBSERVATION.DETAILS.FORMATION_FLIGHT_TITLE_OPTION');
        });
        it(`Le détail doit être ' - VAL' si l'eobs est de type ECCP et que val = true`, () => {
            const eObservation = new EObservationModel();
            eObservation.type= EObservationTypeEnum.E_CCP;
            eObservation.val = true;
            eObservationService.getDetailOptionType(eObservation)
            expect(translateServiceMock.instant).toHaveBeenCalledWith('EOBSERVATION.DETAILS.VAL_TITLE_OPTION');
        });
        it(`Le détail doit être ' - FOR' si l'eobs est de type ECCP et que c'est un vol de formation`, () => {
            const eObservation = new EObservationModel();
            eObservation.type= EObservationTypeEnum.E_CCP;
            eObservation.formationFlight = true;
            eObservationService.getDetailOptionType(eObservation)
            expect(translateServiceMock.instant).toHaveBeenCalledWith('EOBSERVATION.DETAILS.FORMATION_FLIGHT_TITLE_OPTION');
        });
    });
});
