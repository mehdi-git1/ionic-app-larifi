import { SpecialityEnum } from '../../enums/speciality.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';
import { FlightDetailsCardModel } from './flight-details-card.model';

export class BusinessIndicatorModel extends EDossierPncObjectModel {

    pnc: PncModel;
    flightDetailsCard: FlightDetailsCardModel;
    aboardSpeciality: SpecialityEnum;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
