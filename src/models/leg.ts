import { Rotation } from './rotation';
import { EDossierPncObject } from './eDossierPncObject';

export class Leg extends EDossierPncObject {
    company: string;
    number: string;
    departureDate: string;
    departureStation: string;
    arrivalStation: string;
    aircraftType: string;
    rotation: Rotation;
    operatingVersion: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
