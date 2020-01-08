import { SpecialityEnum } from '../../enums/speciality.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { FlightDetailsCardLightModel } from './flight-details-card-light.model';

export class BusinessIndicatorLightModel extends EDossierPncObjectModel {

    flightDetailsCard: FlightDetailsCardLightModel;
    aboardSpeciality: SpecialityEnum;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
