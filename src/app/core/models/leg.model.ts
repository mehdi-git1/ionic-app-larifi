import { RotationModel } from './rotation.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class LegModel extends EDossierPncObjectModel {
    company: string;
    number: string;
    departureDate: string;
    departureStation: string;
    arrivalStation: string;
    aircraftType: string;
    rotation: RotationModel;
    operatingVersion: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
