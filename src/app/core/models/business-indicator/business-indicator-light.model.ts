import { SpecialityEnum } from '../../enums/speciality.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';
import { BusinessIndicatorFlightLightModel } from './business-indicator-flight-light.model';

export class BusinessIndicatorLightModel extends EDossierPncObjectModel {

    pnc: PncModel;
    flight: BusinessIndicatorFlightLightModel;

    aboardSpeciality: SpecialityEnum;
    escore: number;
    flightActionsTotalNumber: number;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
