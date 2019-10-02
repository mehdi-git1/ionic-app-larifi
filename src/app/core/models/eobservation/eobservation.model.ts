import { EObservationStateEnum } from '../../enums/e-observation-state.enum';
import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';
import { SpecialityEnum } from '../../enums/speciality.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';
import { EObservationFlightModel } from './eobservation-flight.model';
import { ReferentialThemeModel } from './eobservation-referential-theme.model';

export class EObservationModel extends EDossierPncObjectModel {

    pnc: PncModel;
    rotationDate: Date;
    type: EObservationTypeEnum;
    state: EObservationStateEnum;
    redactor: PncModel;
    eobservationThemes: ReferentialThemeModel[];
    eobservationFlights: EObservationFlightModel[];
    redactorComment: string;
    pncComment: string;
    redactionDate: Date;
    redactorSpeciality: SpecialityEnum;
    pncSpeciality: SpecialityEnum;
    lastUpdateDate: Date;
    lastUpdateAuthor: PncModel;
    formationFlight: boolean;
    vac: boolean;
    val: boolean;
    strongPoints: string;
    workingAxes: string;
    deleted: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
