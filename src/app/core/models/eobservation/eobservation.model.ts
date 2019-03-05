import { EObservationItemModel } from './eobservation-item.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';
import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';
import { EObservationFlightModel } from './eobservation-flight.model';
import { EObservationStateEnum } from '../../enums/e-observation-state.enum';

export class EObservationModel extends EDossierPncObjectModel {

    pnc: PncModel;
    rotationDate: Date;
    type: EObservationTypeEnum;
    state: EObservationStateEnum;
    redactor: PncModel;
    eobservationItems: EObservationItemModel[];
    eobservationFlights: EObservationFlightModel[];
    redactorComment: string;
    pncComment: string;
    redactionDate: Date;
    redactorSpeciality: string;
    pncSpeciality: string;
    lastUpdateDate: Date;
    formationFlight: boolean;
    vac: boolean;
    val: boolean;
    getStorageId(): string {
        return `${this.techId}`;
    }
}
