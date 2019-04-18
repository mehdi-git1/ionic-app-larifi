import { EObservationTypeEnum } from './../../enums/e-observations-type.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialThemeModel } from './eobservation-referential-theme.model';

export class EObservationFlightModel {

    flightNumber: string;

    flightDate: Date;

    flightOrder: number;

    departureStation: string;

    arrivalStation: string;

    workStation: string;

    aircraftType: string;

    occupancyRate: string;

    exploitationVersion: string;
}
