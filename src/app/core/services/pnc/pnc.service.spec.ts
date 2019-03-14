import { GenderEnum } from './../../enums/gender.enum';
import { UrlConfiguration } from './../../configuration/url.configuration';
import { Config } from './../../../../environments/prod';
import { PncService } from './pnc.service';
import { OfflinePncService } from './offline-pnc.service';
import { fakeAsync } from '@angular/core/testing';
import { PncModel } from '../../models/pnc.model';
import { AssignmentModel } from '../../models/assignment.model';
import { RotationModel } from '../../models/rotation.model';
import { SpecialityEnum } from '../../enums/speciality.enum';

const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['isConnected']);
const onlinePncServiceMock = jasmine.createSpyObj('onlinePncServiceMock', []);
const offlinePncServiceMock = jasmine.createSpyObj('offlinePncServiceMock', []);
const restServiceMock = jasmine.createSpyObj('restServiceMock', ['get']);

describe('PncService', () => {

    let pncService: PncService;
    let pnc: PncModel;

    beforeEach(() => {
        pncService = new PncService(connectivityServiceMock, onlinePncServiceMock, offlinePncServiceMock, restServiceMock, new UrlConfiguration(new Config()));
    });

    describe('getFormatedSpeciality', () => {

        beforeEach(() => {
            pnc = new PncModel();
            pnc.matricule = 'm123456';
        });

        it('doit retourner la spécialité HOT', () => {
            pnc.speciality = SpecialityEnum.STW;
            pnc.gender = GenderEnum.F;
            pnc.currentSpeciality = SpecialityEnum.HOT;
            pnc.operationalSpeciality = SpecialityEnum.HOT;
            expect(pncService.getFormatedSpeciality(pnc)).toBe(SpecialityEnum.HOT);
        });

        it('doit retourner la spécialité STW', () => {
            pnc.speciality = SpecialityEnum.STW;
            pnc.currentSpeciality = SpecialityEnum.STW;
            pnc.operationalSpeciality = SpecialityEnum.STW;
            expect(pncService.getFormatedSpeciality(pnc)).toBe(SpecialityEnum.STW);
        });

        it('doit retourner la spécialité CC/CCP', () => {
            pnc.speciality = SpecialityEnum.CC;
            pnc.currentSpeciality = SpecialityEnum.CCP;
            pnc.operationalSpeciality = SpecialityEnum.CC;
            expect(pncService.getFormatedSpeciality(pnc)).toBe(SpecialityEnum.CC + '/' + SpecialityEnum.CCP);
        });
    });
});
