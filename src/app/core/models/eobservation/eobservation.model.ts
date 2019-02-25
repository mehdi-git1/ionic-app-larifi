import { EObservationItemModel } from './eobservation-item.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';
import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';
import { EObservationFlightModel } from './eobservation-flight.model';

export class EObservationModel extends EDossierPncObjectModel {

    pnc: PncModel;
    rotationDate: Date;
    type: EObservationTypeEnum;
    state: string;
    redactor: PncModel;
    eobservationItems: EObservationItemModel[];
    eobservationFlights: EObservationFlightModel[];
    redactorComment: string;
    pncComment: string;
    redactionDate: Date;
    redactorSpeciality: string;
    pncSpeciality: string;
    getStorageId(): string {
        return `${this.techId}`;
    }
}
