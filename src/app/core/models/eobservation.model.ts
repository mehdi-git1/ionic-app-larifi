import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class EObservationModel extends EDossierPncObjectModel {

    date: Date;
    type: string;
    writer: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
