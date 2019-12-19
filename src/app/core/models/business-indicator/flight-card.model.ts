import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class FlightCardModel extends EDossierPncObjectModel {

    flightDate: Date;

    flightNumber: string;

    departureStation: string;

    arrivalStation: string;

    plannedDepartureDate: Date;

    escore: number;

    flightActionsTotalNumber: number;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
