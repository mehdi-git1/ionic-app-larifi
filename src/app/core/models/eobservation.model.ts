import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';
import { PncModel } from './pnc.model';

export class EObservationModel extends EDossierPncObjectModel {

    rotationDate: Date;
    type: string;
    redactor: PncModel;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
