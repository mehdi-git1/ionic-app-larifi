import { RotationModel } from './rotation.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class LegModel extends EDossierPncObjectModel {
    company: string;
    number: string;
    departureDate: string;
    departureStation: string;
    arrivalStation: string;
    aircraftType: string;
    operatingVersion: string;
    rotationStorageId: string;

    getStorageId(): string {
        return `${this.company}-${this.number}-${this.departureDate}`;
    }
}
