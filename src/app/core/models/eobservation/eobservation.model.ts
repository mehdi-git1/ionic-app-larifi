import { EObservationItemModel } from './eobservation-item.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';
import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';
import { EObservationFlightModel } from './eobservation-flight.model';
import { EObservationStateEnum } from '../../enums/e-observation-state.enum';
import { SpecialityEnum } from '../../enums/speciality.enum';

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
    redactorSpeciality: SpecialityEnum;
    pncSpeciality: SpecialityEnum;
    lastUpdateDate: Date;
    formationFlight: boolean;
    vac: boolean;
    val: boolean;
    strongPoints: string;
    workingAxes: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
